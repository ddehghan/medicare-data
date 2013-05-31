//    http://www.schneidy.com/Tutorials/MapsTutorial.html


var g_test = {};

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
            .style('stroke-width', 1)
            .on('click', click);

        function click(d) {
            var x = 0,
                y = 0,
                k = .8;

            if (d && centered !== d) {
                var centroid = path.centroid(d);
                x = -centroid[0] + width / 8;
                y = -centroid[1] + height / 8;
                k = 4;
                centered = d;
            } else {
                centered = null;
            }

            group.selectAll("path")
                .classed("active", centered && function (d) {
                    return d === centered;
                });

            group.transition()
                .duration(1000)
                .attr("transform", "scale(" + k + ")translate(" + x + width / 4 + "," + y + ")")
                .style("stroke-width", 1.5 / k + "px");
        }

        d3.csv(dataUrl, function (error, data) {

            g_test = data;

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

                    MEDICARE.list_hospitals(chart_position, d.lat, d.lon);

                    return compiledTemplate(data);


                }
            });

        });
    });
};


MEDICARE.list_hospitals = function (position, Lat, Lon) {
    var template = $('#hlist-template').html();
    var compiledTemplate = Handlebars.compile(template);

    var result = [];
    for (var i = 0; i < g_test.length; i++) {
        var d = MEDICARE.latLonDistance(Lat, Lon, g_test[i].lat, g_test[i].lon, "N");
        if (d < 100) {
            result.push(MEDICARE.ShallowCopy(g_test[i]));
//            result.push({
//                'name': g_test[i].name,
//                'charge': formatMoney(g_test[i].charge, 0, '.', ','),
//                'pay': formatMoney(g_test[i].pay, 0, '.', ',')
//            });
        }
    }

    result = result.sort(function (a, b) {
        if (a.charge < b.charge) {
            return 1;
        } else {
            return 0;
        }
    });

    if (result.length > 2) {
        result.splice(1, result.length - 2);
        result[0].isMax = true;
        result[0].pay = MEDICARE.formatMoney(result[0].pay, 0, '.', ',');
        result[0].charge = MEDICARE.formatMoney(result[0].charge, 0, '.', ',');
        result[1].isMin = true;
        result[1].pay = MEDICARE.formatMoney(result[1].pay, 0, '.', ',');
        result[1].charge = MEDICARE.formatMoney(result[1].charge, 0, '.', ',');
    }

    var $position;

    if (position === "#chart1") {
        $position = $('#first-last-list1');
    }
    else {
        $position = $('#first-last-list2');
    }

    $position.html("");
    $position.html(compiledTemplate({'hospitals': result}));
};

