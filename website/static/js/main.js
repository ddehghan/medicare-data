//    http://www.schneidy.com/Tutorials/MapsTutorial.html

function draw_chart(drg_num) {

    var centered;

    var width = 1000, height = 500;

    var svg = d3.select("#chart").append("svg")
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
                    return d.size;
                })
                .style("fill", "red")
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

                    return "<div class='hover-text'><div class='hospital-name'>" + d.name
                        + "</div><div class='avg-price'>Average Price: $" + formatMoney(d.price, 0, '.', ',')
                        + "</div></div>";
                }
            });


        });
    });
}


function get_data() {
    $("svg").remove();

    var e = document.getElementById("drug_name");

    $("#selected_drg").html(e.options[e.selectedIndex].text);

    var drg_num = e.options[e.selectedIndex].value;

    draw_chart(drg_num);

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
