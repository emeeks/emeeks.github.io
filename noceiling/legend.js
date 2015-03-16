d3.svg.legend = function() {
      var data = [];
      var size = [300,20];
      var xScale = d3.scale.linear();
      var scale;
      var title = "Legend";
      var numberFormat = d3.format(".4n");
      var units = "Units";

    function legend(gSelection) {
      
      createLegendData(scale);
      
      var xMin = d3.min(data, function(d) {return d.domain[0]});
      var xMax = d3.max(data, function(d) {return d.domain[1]});
      xScale.domain([xMin,xMax]).range([0,size[0]])

      gSelection.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("height", size[1])
      .attr("width", function (d) {return xScale(d.domain[1]) -  xScale(d.domain[0])})
      .attr("x", function (d) {return xScale(d.domain[0])})
      .style("fill", function(d) {return d.color})

      gSelection.selectAll("line")
      .data(data)
      .enter()
      .append("line")
      .attr("x1", function (d) {return xScale(d.domain[0])})
      .attr("x2", function (d) {return xScale(d.domain[0])})
      .attr("y1", 0)
      .attr("y2", size[1] + 5)
      .style("stroke", "black")
      .style("stroke-width", "2px")

      gSelection.selectAll("text")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function (d) {return "translate(" + (xScale(d.domain[0])) +"," + (size[1] + 20) + ")"})
      .style("text-anchor", "middle")
      .append("text")
      .text(function(d) {return numberFormat(d.domain[0])})

      gSelection.append("text")
      .attr("transform", function (d) {return "translate(" + (xScale(xMin)) +"," + (size[1] - 30) + ")"})
      .text(title)

      gSelection.append("text")
      .attr("transform", function (d) {return "translate(" + (xScale(xMax)) +"," + (size[1] + 20) + ")"})
      .text(units)

      return legend;
    }
    
    function createLegendData(incScale) {
      var rangeArray = incScale.range();
      data = [];
      
      for (x in rangeArray) {
        var colorValue = rangeArray[x];
        var domainValues = incScale.invertExtent(colorValue);
        data.push({color: colorValue, domain: domainValues})
      }
    }

    
    legend.scale = function(newScale) {
      if (!arguments.length) return scale;
      scale = newScale;
      return this;
    }

    legend.title = function(newTitle) {
      if (!arguments.length) return title;
      title = newTitle;
      return this;
    }

    legend.unitLabel = function(newUnits) {
      if (!arguments.length) return units;
      units = newUnits;
      return this;
    }

    legend.formatter = function(newFormatter) {
      if (!arguments.length) return numberFormat;
      numberFormat = newFormatter;
      return this;
    }

    return legend;
  }