//    http://www.schneidy.com/Tutorials/MapsTutorial.html


MEDICARE.data = {};

MEDICARE.draw_chart = function (chart_position, dataUrl, col_name) {
    var centered;
    var width = 850, height = 500;

    var svg = d3.select(chart_position).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", 'chart-svg');

    var group = svg.append("g");
    var projection = d3.geo.albersUsa();
    var path = d3.geo.path().projection(projection);

    group.attr('transorm', 'scale(.3, .3)');

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

        d3.csv(dataUrl, function (error, data) {

            MEDICARE.data = data;

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

            $('svg circle').tipsy({
                gravity: 'w',
                html: true,
                title: function () {
                    var d = this.__data__;

                    var data = {
                        'd_name': d.name,
                        'd_charge': MEDICARE.formatMoney(d.charge, 0, '.', ','),
                        'd_pay': MEDICARE.formatMoney(d.pay, 0, '.', ','),
                        'AcquiredInfect': d.AcquiredInfect,
                        'AcquiredConditions': d.AcquiredConditions,
                        'PatientSafetySummary': d.PatientSafetySummary
                    };

                    var template = $('#tooltip-template').html();
                    var compiledTemplate = Handlebars.compile(template);

                    MEDICARE.list_hospitals("#first-last-list1", d.lat, d.lon);

                    return compiledTemplate(data);


                }
            });

        });
    });
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

    group.attr('transorm', 'scale(.3, .3)');

    group.append("circle")
        .attr("class", "highlighted")
        .attr("cx", projection([lon, lat])[0])
        .attr("cy", projection([lon, lat])[1])
        .attr("r", 20)
        .style("fill", "#111188")
        .style("opacity", .8)
        .style("stroke", "#2F0000");
};


MEDICARE.list_hospitals = function (position, Lat, Lon) {
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

        return num;
    });

    $(position).html();
    $(position).html(compiledTemplate({'hospitals': result}));
};


MEDICARE.lookupZip = function () {

    var zipcode = $("#input-zipcode")[0].value;

    $.getJSON('/zipcode/' + zipcode, function (data) {

        MEDICARE.list_hospitals("#first-last-list3", data.lat, data.lon);

    });

};