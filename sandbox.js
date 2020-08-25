// The svg
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
var projection = d3.geoMercator()
    .center([35,-1])                // GPS of location to zoom on
    .scale(2900)                       // This is like the zoom
    .translate([ width/2, height/2 ])

d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/Mburu-coder/Animated_d3.js/master/kenya.geojson")  // Kenya shape
  .defer(d3.csv, "https://raw.githubusercontent.com/Mburu-coder/Animated_d3.js/master/Population%20in%20Kenyan%20Urban%20centres%202020.csv") // Position of circles
  .await(ready);

function ready(error, dataGeo, data) {

  // Create a color scale
  var allUrbanCentre = d3.map(data, function(d){return(d.urbanCentre)}).keys()
  var color = d3.scaleOrdinal()
    .domain(allUrbanCentre)
    .range(d3.schemePaired);

  // Add a scale for bubble size
  var valueExtent = d3.extent(data, function(d) { return +d.n; })
  var size = d3.scaleSqrt()
    .domain(valueExtent)  // What's in the data
    .range([ 1, 80])  // Size in pixel

  // Draw the map
  svg.append("g")
      .selectAll("path")
      .data(dataGeo.features)
      .enter()
      .append("path")
        .attr("fill", "#b8b8b8")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
      .style("stroke", "none")
      .style("opacity", .3)

  // Add circles:
  svg
    .selectAll("myCircles")
    .data(data.sort(function(a,b) { return +b.n - +a.n }).filter(function(d,i){ return i<1000 }))
    .enter()
    .append("circle")
      .attr("cx", function(d){ return projection([+d.lon, +d.lat])[0] })
      .attr("cy", function(d){ return projection([+d.lon, +d.lat])[1] })
      .attr("r", function(d){ return size(+d.n) })
      .style("fill", function(d){ return color(d.urbanCentre) })
      .attr("stroke", function(d){ if(d.n>2000){return "black"}else{return "none"}  })
      .attr("stroke-width", 1)
      .attr("fill-opacity", .4)



  // Add title and explanation
  svg
    .append("text")
      .attr("text-anchor", "end")
      .style("fill", "black")
      .attr("x", width - 10)
      .attr("y", height - 30)
      .attr("width", 90)
      .html("2020 POPULATION IN URBAN CENTRES IN KENYA")
      .style("font-size", 14)


  // --------------- //
  // ADD LEGEND //
  // --------------- //

  // Add legend: circles
  var valuesToShow = [10000,120000,500000]
  var xCircle = 300
  var xLabel = 380
  var yCircle = 250
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("circle")
      .attr("cx", xCircle)
      .attr("cy", function(d){ return height - size(d) } )
      .attr("r", function(d){ return size(d) })
      .style("fill", "none")
      .attr("stroke", "black")

  // Add legend: segments
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("line")
      .attr('x1', function(d){ return xCircle + size(d) } )
      .attr('x2', xLabel)
      .attr('y1', function(d){ return height - size(d) } )
      .attr('y2', function(d){ return height - size(d) } )
      .attr('stroke', 'black')
      .style('stroke-dasharray', ('2,2'))

  // Add legend: labels
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("text")
      .attr('x', xLabel)
      .attr('y', function(d){ return height - size(d) } )
      .text( function(d){ return d } )
      .style("font-size", 10)
      .attr('alignment-baseline', 'middle')
}
