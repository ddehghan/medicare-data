//    http://www.schneidy.com/Tutorials/MapsTutorial.html


MEDICARE.data = undefined;
MEDICARE.USMap = {"download": "not-started", "observers": []};
MEDICARE.DRGData = {"download": "not-started", "observers": [], "data": undefined};
MEDICARE.drawRequests = [];


function DownloadMap(context) {

    MEDICARE.USMap.observers.push(context);

    if (MEDICARE.USMap.download == "not-started") {
        MEDICARE.USMap.download = "requested";

        d3.json('/static/json/us-states.json', function (collection) {
            MEDICARE.USMap.download = "done";

            var projection = d3.geo.albersUsa();
            var path = d3.geo.path().projection(projection);

            var defs = context.svg.append("defs");
            var group = defs.append("g");
            group.attr('transform', context.scale);
            group.attr('id', 'usmap-svg');

            group.selectAll('path')
                .data(collection.features)
                .enter().append('path')
                .attr('d', d3.geo.path().projection(projection))
                .attr('id', function (d) {
                    return d.properties.name.replace(/\s+/g, '')
                })
                .style('fill', 'gray')
                .style('stroke', 'white')
                .style('stroke-width', 1);

            DownloadMapFinished();

        });

    } else if (MEDICARE.USMap.download == "done") {
        DownloadMapFinished();
    }
}

function DownloadMapFinished() {
    while (MEDICARE.USMap.observers.length > 0) {
        var context = MEDICARE.USMap.observers.pop();

        var use = context.svg.select(".map-group").append("use");
        use.attr('xlink:href', '#usmap-svg');
    }
}

function DownloadDRGData(dataUrl, context) {

    MEDICARE.DRGData.observers.push(context);

    if (MEDICARE.DRGData.download == "not-started") {
        MEDICARE.DRGData.download = "requested";

        d3.csv(dataUrl, function (error, data) {
            MEDICARE.DRGData.data = data;

            DownloadDRGDataFinished();

        });

    } else if (MEDICARE.DRGData.download == "done") {
        DownloadDRGDataFinished();
    }
}

function DownloadDRGDataFinished() {
    while (MEDICARE.DRGData.observers.length > 0) {
        var context = MEDICARE.DRGData.observers.pop();

        var projection = d3.geo.albersUsa();

        var group = context.svg.select(".data-group");
        group.attr('transform', context.scale);

        group.selectAll("circle")
            .data(MEDICARE.DRGData.data)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function (d) {
                return projection([d.lon, d.lat])[1];
            })
            .attr("r", function (d) {
                return d[context.col_name];
            })
            .style("fill", "red")
            .style("opacity", .5)
            .style("stroke", "#2F0000")
            .on("mouseover", function () {
                d3.select(this).style("fill", "blue");
            })
            .on("mouseout", function () {
                d3.select(this).style("fill", "red");
            });

        MEDICARE.toolTip();
    }
}

MEDICARE.draw_chart = function (chart_position, dataUrl, col_name) {
    var centered;

    var scale = 'scale(.9, .9)';


//    $(chart_position + " svg").remove();

    var svg = d3.select(chart_position + " svg");

    var projection = d3.geo.albersUsa();
    var path = d3.geo.path().projection(projection);

    DownloadMap({"svg": svg, "scale": scale});
    DownloadDRGData(dataUrl, {"svg": svg, "col_name": col_name, "scale": scale});
};


MEDICARE.draw_highlight = function (chart_position, lat, lon) {
    var group;

    if ($(chart_position + " .highlighted").length === 0) {
    } else {
        group = $(chart_position + " .highlighted").remove();
    }

    var svg = d3.select(chart_position).select("svg");
    group = svg.append("g");
    var projection = d3.geo.albersUsa();

    group.attr('transform', 'scale(.9, .9)');

    group.append("circle")
        .attr("class", "highlighted")
        .attr("cx", projection([lon, lat])[0])
        .attr("cy", projection([lon, lat])[1])
        .attr("r", 20);
};


MEDICARE.list_hospitals = function (list_position, chart_position, Lat, Lon) {
    var template = $('#hlist-template').html();
    var compiledTemplate = Handlebars.compile(template);

    var result = [];

    _.each(MEDICARE.data, function (num) {
        var d = MEDICARE.latLonDistance(Lat, Lon, num.lat, num.lon, "N");
        if (d < 100) {
            result.push(MEDICARE.ShallowCopy(num));
        }
    });

    result = _.sortBy(result,function (num) {
        return num.charge;
    }).reverse();


    result = _.map(result, function (num) {
        num.pay = MEDICARE.formatMoney(num.pay, 0, '.', ',');
        num.charge = MEDICARE.formatMoney(num.charge, 0, '.', ',');
        num.chartName = chart_position;

        return num;
    });

    $(list_position).html();
    $(list_position).html(compiledTemplate({'hospitals': result}));
};


MEDICARE.lookupZip = function (list_position, chart_position) {
    var zipcode = $(list_position + " .input-zipcode")[0].value;

    $.getJSON('/zipcode/' + zipcode, function (data) {
        MEDICARE.list_hospitals(list_position + " .hospital-list", chart_position, data.lat, data.lon);
    });
};