MEDICARE.plotXY = function (drg_num) {
    var margin = {top: 20, right: 40, bottom: 30, left: 60},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#chart3").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv('/static/data/' + drg_num + '.csv', function (error, data) {
        data.forEach(function (d) {
            d.charge = +d.charge;
            d.pay = +d.pay;
        });

        x.domain(d3.extent(data, function (d) {
            return d.charge;
        })).nice();
        y.domain(d3.extent(data, function (d) {
            return d.pay;
        })).nice();

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Medicare Reimbursement");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Hospital Bill");

        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", function (d) {
                return 3; //d.petalLength;
            })
            .attr("cx", function (d) {
                return x(d.charge);
            })
            .attr("cy", function (d) {
                return y(d.pay);
            })
            .style("fill", "red");
//            .style("fill", function (d) {
//                return '#ccc';
//                color(d.species);
//            });


        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });


        $('svg circle').tipsy({
            gravity: 'w',
            html: true,
            title: function () {
                var d = this.__data__;

                var data = {
                    'd_name': d.name,
                    'd_charge': MEDICARE.formatMoney(d.charge, 0, '.', ','),
                    'd_pay': MEDICARE.formatMoney(d.pay, 0, '.', ',')
                };

                var template = $('#tooltip-template').html();
                var compiledTemplate = Handlebars.compile(template);

                return compiledTemplate(data);

            }
        });
    });
};



MEDICARE.get_drg = function () {
    $("svg").remove();

    var e = document.getElementById("drug_name");

    $(".selected_drg").html(e.options[e.selectedIndex].text);

    return e.options[e.selectedIndex].value;
};


MEDICARE.LoadOptions = function (callback) {
    $.getJSON('/static/data/drg_options.json', function (jsonData) {
        $.each(jsonData, function (i, j) {
            $('#drug_name').append($('<option></option>').val(j.value).html(j.text));
        });

        callback();
    });
};

