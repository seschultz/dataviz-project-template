var lowColor = '#f9f9f9'
	var highColor = '#209222'
  
  var bigText = d3.select("body").append('text')
  .classed('big-text', true);
  
  var barSVG = d3.select("body").append('svg')
  	.attr("width", 200)
  	.attr("height",200)
  	.attr("transform", `translate(0, -100)`);

	var projection = d3
		.geoMercator() 
		.scale(37000)	
		.rotate([-0.25, 0.25, 0]) 
		.center([-80.4, 40.5]); 
	
	var path = d3.geoPath().projection(projection);　
	  
	var map = d3.select("body")
		.append("svg")
		.attr("width", 960)
		.attr("height", 500);
    //.attr('transform', `translate(0, 0)`);
  
	
	function type(d){
        d.TotalEnrollment=+d.TotalEnrollment;
        d.TotalDiagnosed=+d.TotalDiagnosed;
        return d;
  }
    
  
  function barChart(tract){

    barSVG.selectAll('rect').remove()
    barSVG.selectAll('text').remove()
    
    diagRect=barSVG.append('rect')
        .attr('class', 'bar')
        .attr('height', +tract.properties.diag/50)
        .attr('width', 50)
        .attr('fill', 'red')
      	.attr('transform', `translate(70, 0)`);
    
    diagLabel=barSVG.append('text')
    		.attr('class','label')
    		.attr('x',65)
    		.attr('y', 150)
    		.text("Diagnosed");
       
    enRect=barSVG.append('rect')
    		.attr('class', 'bar')
    		.attr('height', +tract.properties.en/50)
    		.attr('width', 50)
    		.attr('fill', 'blue')
    		.attr('transform', `translate(140, 0)`);   
    
     diagLabel=barSVG.append('text')
    		.attr('class','label')
    		.attr('x',140)
    		.attr('y', 150)
    		.text("Enrolled");
    
  }
  
  function hover(d){
    if(d.properties.value==undefined){
      valueString='no data'
    }
    else valueString=d.properties.value
    bigText.text('Census Tract ' + d.properties.TRACTCE +', Proportion Diagnosed: ' + valueString);
    //barChart(d)
  }
    
  d3.csv("diabetes2015_tractNums.csv", type, function(data){
    const minVal=0;
    const maxVal=0.2;
        
    var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor]);
    
    /*var colorLegend = d3.legend.color()
        .labelFormat(d3.format(".0f"))
        .scale(ramp)
        .shapePadding(5)
        .shapeWidth(50)
        .shapeHeight(20)
        .labelOffset(12);

      svg.append("g")
        .attr("transform", "translate(352, 60)")
        .call(colorLegend);*/
    
    d3.json("Allegheny_County_Census_Tracts_2016.geojson", function(json){
      
      // Loop through each census tract value in the .csv file
    	for (var i = 0; i < data.length; i++) {
        
      	// Grab census tract id
      	var dataTract = data[i].CensusTract;
        
      	// Grab proportion diagnosed of those enrolled 
      	var proportionDiag = data[i].TotalDiagnosed/data[i].TotalEnrolled;
        
        // Find the corresponding state inside the GeoJSON
      for (var j = 0; j < json.features.length; j++) {
        var jsonTract = json.features[j].properties.TRACTCE;

        if (dataTract == jsonTract) {

          // Copy the data values into the JSON
          json.features[j].properties.en = data[i].TotalEnrolled;
          json.features[j].properties.diag = data[i].TotalDiagnosed;
          json.features[j].properties.value = proportionDiag;

          // Stop looking through the JSON
          break;
        }   
      }
      }
      map.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
			.attr("d", path)  
			.attr("stroke", "#828282")
      .attr("fill", function(d) { return ramp(d.properties.value) })
      //.attr("legend", true)
      .on("mouseover", function(d){hover(d)})
      .on("click", function(d){barChart(d)});
			
    })
    
   })
