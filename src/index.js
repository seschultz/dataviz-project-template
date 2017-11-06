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
	
	d3.json("data/Allegheny_County_Census_Tracts_2016.geojson", drawMaps);
	
	function drawMaps(geojson) {
		map.selectAll("path")
			.data(geojson.features)
			.enter()
			.append("path")
			.attr("d", path)  
			.attr("fill", "green")
			.attr("fill-opacity", 0.6)
			.attr("stroke", "#222");    
	}
