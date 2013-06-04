//    http://www.schneidy.com/Tutorials/MapsTutorial.html


MEDICARE.data = undefined;
MEDICARE.USMap = undefined;
MEDICARE.drawRequests = [];
MEDICARE.drawMapRequests = [];

var drawDataPoints = function (data, scale, col_name, svg) {

    var projection = d3.geo.albersUsa();

    var group = svg.append("g");
    group.attr('transform', scale);

    group.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function (d) {
            return projection([d.lon, d.lat])[1];
        })
        .attr("r", function (d) {
            return d[col_name];
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
};

$('body').on('map-done', function (event, param1, param2) {

    while (MEDICARE.drawMapRequests.length > 0) {
        var svg = MEDICARE.drawMapRequests.pop();

        var use = svg.append("use");
        use.attr('xlink:href', '#usmap-svg');
    }
});


MEDICARE.draw_chart = function (chart_position, dataUrl, col_name) {
    var centered;
    var width = 780, height = 500;
    var scale = 'scale(.9, .9)';


    $(chart_position + " svg").remove();

    var svg = d3.select(chart_position).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", 'chart-svg');

    var projection = d3.geo.albersUsa();
    var path = d3.geo.path().projection(projection);


    if (MEDICARE.USMap === undefined) {
        var defs = svg.append("defs");
        var group = defs.append("g");
        group.attr('transform', scale);
        group.attr('id', 'usmap-svg');

        d3.json('/static/json/us-states.json', function (collection) {
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

            MEDICARE.USMap = collection;
            $('body').trigger('map-done', ['Custom', 'Event']);

        });

        MEDICARE.drawMapRequests.push(svg);
    }
    else {
        MEDICARE.drawMapRequests.push(svg);
    }

    if (MEDICARE.data === undefined) {

        MEDICARE.data = null;

        d3.csv(dataUrl, function (error, data) {
            MEDICARE.data = data;

            MEDICARE.drawRequests.push(function () {
                drawDataPoints(MEDICARE.data, scale, col_name, svg);
            });

            while (MEDICARE.drawRequests.length > 0) {
                MEDICARE.drawRequests.pop()();
            }
        });
    }
    else {
        MEDICARE.drawRequests.push(function () {
            drawDataPoints(MEDICARE.data, scale, col_name, svg);
        });
    }
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