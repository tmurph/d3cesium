/*global d3, sharedObject */
(function () {
    "use strict";

    // Various accessors that specify the four dimensions of data to visualize.
    function x(d) { return d.count; }
    function y(d) { return d.avg_approval; }
    function radius(d) { return 10; }
    function color(d) { return d.city; }
    function key(d) { return d.city; }

    // Chart dimensions.
    var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5},
        width = 960 - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Various scales. These domains make assumptions of data, naturally.
    var xScale = d3.scale.linear().domain([0, 350]).range([0, width]),
        yScale = d3.scale.linear().domain([5e4, 1.1e6]).range([height, 0]),
        radiusScale = d3.scale.sqrt().domain([0, 40]).range([0, 40]),
        colorScale = d3.scale.category20c();

    // The x & y axes.
    var xAxis = d3.svg.axis().orient("bottom").scale(xScale),
        yAxis = d3.svg.axis().scale(yScale).orient("left");

    // Create the SVG container and set the origin.
    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the x-axis.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the y-axis.
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Add an x-axis label.
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("number of loans approved");

    // Add a y-axis label.
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("average gross approval (dollars)");

    // Add the year label; the value is set on transition.
    var label = svg.append("text")
        .attr("class", "year label")
        .attr("text-anchor", "start")
        .attr("y", 28)
        .attr("x", 30)
        .text(1991);

    // Load the data.
    d3.json("loans.json", function(loans) {

      // A bisector since many nation's data is sparsely-defined.
      var bisect = d3.bisector(function(d) { return d[0]; });

      // Positions the dots based on data.
      function position(dot) {
        dot .attr("cx", function(d) { return xScale(x(d)); })
            .attr("cy", function(d) { return yScale(y(d)); })
            .attr("r", function(d) { return radiusScale(radius(d)); });
      }

      // Defines a sort order so that the smallest dots are drawn on top.
      function order(a, b) {
        return radius(b) - radius(a);
      }
      // Interpolates the dataset for the given (fractional) year.
      function interpolateData(year) {
        sharedObject.yearData = loans.map(function(d) {
          return {
            city: d.city,
            avg_approval: interpolateValues(d.avg_approval, year),
            count: interpolateValues(d.count, year)
          };
        });

        return sharedObject.yearData;
      }

      // Add a dot per nation. Initialize the data at 1800, and set the colors.
      var dot = svg.append("g")
          .attr("class", "dots")
        .selectAll(".dot")
          .data(interpolateData(1991))
        .enter().append("circle")
          .attr("class", "dot")
          .style("fill", function(d) { return colorScale(color(d)); })
          .call(position)
          .sort(order);

      // Add a title.
      dot.append("title")
          .text(function(d) { return d.city; });


      // Tweens the entire chart by first tweening the year, and then the data.
      // For the interpolated data, the dots and label are redrawn.
      function tweenYear() {
        var year = d3.interpolateNumber(1991, 2016);
        return function(t) { displayYear(year(t)); };
      }

      // Updates the display to show the specified year.
      function displayYear(year) {
        dot.data(interpolateData(year), key).call(position).sort(order);
        label.text(Math.round(year));
      }

      // make displayYear global
      window.displayYear = displayYear;
        var timingVar = setInterval(tickYear, 100);
        var globalYear = 1991
        function tickYear() {
            if (globalYear > 2016){
                globalYear = 1991
            } else {
                globalYear = globalYear + 1/12
            };

            displayYear(globalYear);
        };

      // Finds (and possibly interpolates) the value for the specified year.
      function interpolateValues(values, year) {
        var i = bisect.left(values, year, 0, values.length - 1),
            a = values[i];
        if (i > 0) {
          var b = values[i - 1],
              t = (year - a[0]) / (b[0] - a[0]);
          return a[1] * (1 - t) + b[1] * t;
        } else {
        return a[1];
        };
      };

    });
}());
