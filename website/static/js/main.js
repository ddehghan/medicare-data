//    http://www.schneidy.com/Tutorials/MapsTutorial.html

var g_test = {};

//Handlebars.registerHelper('list', function (items, options) {
//    var out = "<ul>";
//
//    for (var i = 0, l = items.length; i < l; i++) {
//        out = out + "<li>" + options.fn(items[i]) + "</li>";
//    }
//
//    return out + "</ul>";
//});

Handlebars.registerHelper('list', function (items, options) {
    var out = "";

    for (var i = 0, l = items.length; i < l; i++) {
        out = out + options.fn(items[i]);
    }

    return out;
});

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles                                   :::
//:::                  'K' is kilometers (default)                            :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at http://www.geodatasource.com                          :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: http://www.geodatasource.com                        :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2013            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var radlon1 = Math.PI * lon1 / 180;
    var radlon2 = Math.PI * lon2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
        dist = dist * 1.609344;
    }
    if (unit == "N") {
        dist = dist * 0.8684;
    }
    return dist
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}


function draw_chart(chart_position, drg_num, col_name) {
    var centered;
    var width = 850, height = 500;

    var svg = d3.select(chart_position).append("svg")
        .attr("width", width)
        .attr("height", height);

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

        d3.csv('/static/data/' + drg_num + '.csv', function (error, data) {

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
                        'd_charge': formatMoney(d.charge, 0, '.', ','),
                        'd_pay': formatMoney(d.pay, 0, '.', ',')
                    };

                    var template = $('#tooltip-template').html();
                    var compiledTemplate = Handlebars.compile(template);

                    list_hospitals(chart_position, d.lat, d.lon);

                    return compiledTemplate(data);


                }
            });

        });
    });
}


function list_hospitals(position, Lat, Lon) {
    var template = $('#hlist-template').html();
    var compiledTemplate = Handlebars.compile(template);

    var result = [];
    for (var i = 0; i < g_test.length; i++) {
        var d = getDistanceFromLatLonInKm(Lat, Lon, g_test[i].lat, g_test[i].lon);
        if (d < 100) {
            result.push({
                'name': g_test[i].name,
                'charge': formatMoney(g_test[i].charge, 0, '.', ','),
                'pay': formatMoney(g_test[i].pay, 0, '.', ',')
            });
        }
    }

    result = result.sort(function (a, b) {
        if (a.charge < b.charge) {
            return 1;
        } else {
            return 0;
        }
    });

    result.splice(1, result.length - 2);
    result[0].isMax = true;
    result[1].isMin = true;

    var $position;

    if (position === "#chart1") {
        $position = $('#first-last-list1');
    }
    else {
        $position = $('#first-last-list2');
    }

    $position.html(compiledTemplate({'hospitals': result}));
}

function get_data() {
    $("svg").remove();

    var e = document.getElementById("drug_name");

    $(".selected_drg").html(e.options[e.selectedIndex].text);

    var drg_num = e.options[e.selectedIndex].value;

    draw_chart('#chart1', drg_num, 'size_charge');
    draw_chart('#chart2', drg_num, 'size_pay');

}

function formatMoney(n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

function LoadOptions() {
    $.getJSON('/static/data/drg_options.json', function (jsonData) {
        $.each(jsonData, function (i, j) {
            $('#drug_name').append($('<option></option>').val(j.value).html(j.text));
        });

        get_data();
    });
}

LoadOptions();