$(function() {

  const r = 3
  
  var margin = {top: 0 + r, right: 5 + r, bottom: 15 + r, left: 5 + r};
  var width = 1000;
  var height = 80;

  d3.json("/stats", function(error, data) {
    if (error) throw error;
    
    var x = d3.scaleLinear()
      .rangeRound([0, width - margin.left - margin.right])
      .domain([0, d3.max(data, (d) => d.time)]);
    var y = d3.scaleLinear()
      .range([height - margin.top - margin.bottom, 0])
      .domain([0,200]);

    draw(data);
    
    for(var i = 1; i <= 7; i++) {
      draw(data.filter((d) => d.day == i));
    }
    
  
    function draw(data) {
      
      var simulation = d3.forceSimulation(data)
          .force("x", d3.forceX((d) => x(d.time)).strength(1))
          .force("y", d3.forceY(height / 2))
          .force("collide", d3.forceCollide(4))
          .stop();

      console.log(data);
      
      for (var i = 0; i < 120; ++i) simulation.tick();
      
      var row = d3.select("main").append("div");
      var svg = row.append("svg")
          .attr("width", width)
          .attr("height", height)
      
      var g = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + (height - margin.bottom - margin.top) + ")")
          .call(d3.axisBottom(x).ticks(20, ".0s"));

      var cell = g.append("g")
          .attr("class", "cells")
        .selectAll("g").data(d3.voronoi()
            .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.top]])
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
          .polygons(data)).enter().append("g");

      cell.append("circle")
          .attr("r", 3)
          .attr("cx", function(d) { return d.data.x; })
          .attr("cy", function(d) { return d.data.y; });

      cell.append("path")
          .attr("d", function(d) { return "M" + d.join("L") + "Z"; });

      cell.append("title")
          .text(function(d) { return d.data.id + "\n" + d.data.time; });

      
      
      
      //var bins = histogram(data);

      //y.domain([0, d3.max(bins, (d) => d.length)]);

      
      //svg.selectAll("rect")
      //    .data(bins)
      //  .enter().append("rect")
      //    .attr("class", "bar")
      //    .attr("x", 1)
      //    .attr("transform", function(d) {
      //    return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
      //    .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
      //    .attr("height", function(d) { return height - y(d.length); });

      //svg.append("g")
      //    .attr("transform", "translate(0," + height + ")")
          //.call(d3.axisBottom(x));

    }  
    
  });

});
