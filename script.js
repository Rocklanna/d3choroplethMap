const w=1500;
const h = 600;
const padding = 50;


var svg = d3.select("#topoMap")
            .append("svg")
            .attr("width",w)
            .attr("height",h);


var path = d3.geoPath();

var promises = [
  d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"),
  d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
];


Promise.all(promises).then(ready);

function ready([us,education]) {
  
 var eduRate = d3.map(education,(d)=>d["bachelorsOrHigher"])
 
 var tooltip= d3.select("#main")
                 .append("div")
                 .attr("id","tooltip");
  
  var domainX = d3.extent(eduRate,(d)=>d);
  
  
  var legendX = d3.scaleLinear()
                 .domain(domainX)
                  .range([700,1000]);
   
    var legendColorX = d3.scaleThreshold()
                            .domain(d3.range(domainX[0],domainX[1],(domainX[1]-domainX[0])/8))
                           .range(d3.schemePurples[9]);
  
  var legendXAxis = d3.axisBottom(legendX)
                       .tickFormat(function (x) {
      return Math.round(x) + '%';
    })
    .tickValues(legendColorX.domain());
  
    var legend = svg.append("g")
                  .attr("id","legend")  
                  .attr("transform","translate("+(300)+","+padding+")")
                  .call(legendXAxis);
  
  d3.select("#header")
  .append("div")
   .attr("id","title")
    .html("United States Educational Attainment");
  
   d3.select("#header")
    .append("div")
    .attr("id","description")
    .html("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)");
  
  legend.selectAll("rect")
          .data(legendColorX.domain())
          .enter()
          .append("rect")
          .attr("x",(d)=>legendX(d))
          .attr("y",-20)
          .attr("width","40")
          .attr("height","20")
          .style("fill",(d)=>legendColorX(d));
   
    svg.append("g")
      .attr("class", "counties")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .enter()
      .append("path")
      .attr('class', 'county')
      .attr("data-fips",(d)=>d.id)
      .attr("data-education",function(d) { 
      var dataRate = education.filter(function(item){
      return item.fips === d.id
      });
      
      if(dataRate[0]){
        
       return dataRate[0]["bachelorsOrHigher"]
      }// end of if
})
      .attr("fill", function(d) { 
      var dataRate = education.filter(function(item){
      return item.fips === d.id
      });
      
      if(dataRate[0]){
        
       return legendColorX(dataRate[0]["bachelorsOrHigher"])
      }// end of if
})
      .attr("d", path)
     .on("mouseover",function(event,d){
      tooltip.attr("data-education",function() { 
      var dataRate = education.filter(function(item){
      return item.fips === d.id
      });
      
      if(dataRate[0]){
        
       return dataRate[0]["bachelorsOrHigher"]
      }// end of if
})
      .style("visibility","visible")
      .style("top",(event.pageY)+"px")
      .style("left",(event.pageX)+"px") 
      .style("stroke","black")
      .html(function() { 
      var dataRate = education.filter(function(item){
      return item.fips === d.id
      });
      
      if(dataRate[0]){
        
    return (dataRate[0]["area_name"] +", "+
        dataRate[0]["state"] +": "+
        dataRate[0]["bachelorsOrHigher"] +"%"+
        "<br"    
     )}// end of if
})
    })
   .on("mouseout",function(){
      tooltip.style("visibility","hidden")
    });

  
 /* console.log(us);
   console.log(education);
  console.log(eduRate);
  console.log(domainX);
 console.log(educate);
   console.log(education.get(5089));*/
 
}