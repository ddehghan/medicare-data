var drawDataPointsXY = function (data, chart_position) {
    $(chart_position + " svg").remove();

    var margin = {top: 20, right: 40, bottom: 30, left: 60},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

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

    var svg = d3.select(chart_position).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
        .text("Hospital Bill");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Medicare Reimbursement");

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

    MEDICARE.toolTip();
};


var costVsQuality = function (data, chart_position, col_name) {
    $(chart_position + " svg").remove();

    var margin = {top: 20, right: 40, bottom: 30, left: 60},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

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

    var svg = d3.select(chart_position).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function (d) {
        d.charge = +d.charge;
        d.AcquiredConditions = +d.AcquiredConditions;
    });

    x.domain(d3.extent(data, function (d) {
        return d.charge;
    })).nice();
    y.domain(d3.extent(data, function (d) {
        return d.AcquiredConditions;
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
        .text("Cost");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Quality");

    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", function (d) {
            return 3; //d.petalLength;
        })
        .attr("cx", function (d) {
            return x(d.charge);
        })
        .attr("cy", function (d) {
            return y(d[col_name]);
        })
        .style("fill", "blue");


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


    MEDICARE.toolTip();

};

MEDICARE.downloadAndPaint = function (type, chart_position, dataUrl) {

    if (MEDICARE.DRGData.data === undefined) {
        MEDICARE.DRGData.data = null;

        d3.csv(dataUrl, function (error, data) {
            MEDICARE.DRGData.data = data;

            MEDICARE.drawRequests.push(function () {
                type(MEDICARE.DRGData.data, chart_position);
            });

            while (MEDICARE.drawRequests.length > 0) {
                MEDICARE.drawRequests.pop()();
            }

            $("#wait-icon").css('display', 'none');

        });
    }
    else {
        MEDICARE.drawRequests.push(function () {
            type(MEDICARE.DRGData.data, chart_position);
        });
    }
};

MEDICARE.downloadAndPaintQuality = function (type, chart_position, dataUrl, col_name) {

    if (MEDICARE.DRGData.data === undefined) {
        MEDICARE.DRGData.data = null;

        d3.csv(dataUrl, function (error, data) {
            MEDICARE.DRGData.data = data;

            MEDICARE.drawRequests.push(function () {
                type(MEDICARE.DRGData.data, chart_position, col_name);
            });

            while (MEDICARE.drawRequests.length > 0) {
                MEDICARE.drawRequests.pop()();
            }

            $("#wait-icon").css('display', 'none');

        });
    }
    else {
        MEDICARE.drawRequests.push(function () {
            type(MEDICARE.DRGData.data, chart_position, col_name);
        });
    }
};

