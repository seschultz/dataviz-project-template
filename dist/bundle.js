/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

  	var lowColor = '#f9f9f9'
  	var highColor = '#209222'

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
	
	function type(d){
        d.TotalEnrollment=+d.TotalEnrollment;
        d.TotalDiagnosed=+d.TotalDiagnosed;
        return d;
  }
    
  //d3.json("Allegheny_County_Census_Tracts_2016.geojson", drawMaps);
	
  //TRACTCE in json corresponds to CensusTract number in csv
  
  var tracts=[];
  
  d3.csv("data/diabetes2015_tractNums.csv", type, function(data){
    const minVal=0;
    const maxVal=0.2;
    
    var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor]);
    
    d3.json("data/Allegheny_County_Census_Tracts_2016.geojson", function(json){
      
      // Loop through each census tract value in the .csv file
    	for (var i = 0; i < data.length; i++) {

      	// Grab census tract id
      	var dataState = data[i].CensusTract;

      	// Grab proportion diagnosed of those enrolled 
      	var dataValue = data[i].TotalDiagnosed/data[i].TotalEnrolled;
        
        // Find the corresponding state inside the GeoJSON
      for (var j = 0; j < json.features.length; j++) {
        var jsonState = json.features[j].properties.TRACTCE;

        if (dataState == jsonState) {

          // Copy the data value into the JSON
          json.features[j].properties.value = dataValue;

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
			.attr("stroke", "#222")
      .attr("fill", function(d) { return ramp(d.properties.value) });

    })
    
    })


/***/ })
/******/ ]);