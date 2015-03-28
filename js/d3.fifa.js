/*
SvgModule contains the following methods. 

public methods.

private methods. 




*/
var SvgModule = (function () {
	var init,
		svg,
		selectTab,
		selectSort, 
		drawChoropleth, 
		drawBarChart, 
		drawStackedBarChart,
		initPlayBack,
		curTab,
		curSortType,
		visType,
		ready,
		fifa_all_projects,
		fifa_by_country_wide,
		world_countries,
		topCountries,
		topProjects,
		storyline,
		heading,
		budgetById,
		div_map_tip,
		div_left_bar_tip,
		div_storyline_tip,
		h,
		playBackNav,
		playback,
		lineGraph,
		playing = false,
		counter = 0,
		myInterval,
		barChartParams = {},
		paramsClassChart = {},
		paramsRegionChart = {},
		paramsTopCountriesChart = {},
		paramsTopProjectsChart = {};

	//margins for main plots and choroplet
	var margin = {top: 20, right: 0, bottom: 30, left: 200},
		width = 1000 - margin.left - margin.right,
		height = 550 - margin.top - margin.bottom;
	
	//text formats
	var text_format = d3.format(".2s"); //millions
	var text_format_long = d3.format(".2d"); //long format 
	
	//sort function
	var sortItemsBudget = function(a,b) { return +b.TotalBudget - +a.TotalBudget }
	var sortItemsNumbers = function(a,b) { return +b.n - +a.n }
	
	var projection = d3.geo.mercator()
						   .scale(120)
						   .translate([width / 1.3, height / 1.25]);

	var path = d3.geo.path().projection(projection);
		
	init = function(){
	//Vis init. Load all data, draw first tab graph
		$("#sort_div").css("display", "none");
		heading = "Budgets of FIFA Development projects by countries";
		queue()
			.defer(d3.csv, "data/fifa_all_projects.csv")
			.defer(d3.csv, "data/fifa_by_country.csv")
			.defer(d3.json, "data/world_countries.json")	
			.defer(d3.csv, "data/fifa_by_class.csv")
			.defer(d3.csv, "data/fifa_by_region.csv")
			.defer(d3.csv, "data/storyline.csv")
			.await(ready);	
		
		//SVG
		svg = d3.select(".chart")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);
		
		//Tips по умолчанию
		div_map_tip = d3.select("body").append("div")   
			.attr("class", "tooltip")               
			.style("opacity", 0);	
			
		div_left_bar_tip = d3.select("body").append("div")   
			.attr("class", "tooltip")               
			.style("opacity", 0)
			.style("text-align", "left")
			.style("width", "200px");

		div_storyline_tip = d3.select("body").append("div")   
			.attr("class", "tooltip")               
			.style("opacity", 0)
			.style("text-align", "left")
			.style("width", "300px");
			
		//ѕараметры по-умолчанию дл€ всех BarCharts. ѕри использовании мы будем их наследовать и измен€ть необходимые параметры
		barChartParams = {  "width" : width,
							"height" : height,
							"xFeature" : "TotalBudget",
							"yFeature" : "Region",
							"xScaleType" : "linear",
							"margin" : margin,
							"showAxis" : true,
							"xPosChart" : 0,
							"yPosChart" : 10,
							"text_format" :text_format,
							"xAxisText" :  "Total budget ($)",
							"sortItems" : sortItemsBudget,
							"labelBar": "id"
						}
		paramsClassChart.__proto__ = barChartParams;
		paramsRegionChart.__proto__ = barChartParams;
		paramsTopCountriesChart.__proto__ = barChartParams;
		paramsTopProjectsChart.__proto__ = barChartParams;
	}
	
	ready = function(error, file1, file2, file3, file4, file5, file6){
		fifa_all_projects = file1;
		fifa_by_country_wide = file2;
		world_countries = file3;
		fifa_by_class = file4;
		fifa_by_region_wide = file5;
		storyline = file6;
		budgetById = d3.map();
		for(var i=0;i<fifa_by_country_wide.length;i++){
			budgetById.set(fifa_by_country_wide[i].id, +fifa_by_country_wide[i].TotalBudget);
		}		
		topCountries = fifa_by_country_wide.sort(sortItemsBudget).slice(0,15);
		topProjects = fifa_all_projects.sort(sortItemsBudget).slice(0,15);
		drawChoropleth();
	}
	

	selectGraph = function(){
	//Select tab 
		if($(this).hasClass("tab") ){
			$(".tabs div.tab.active").removeClass("active")
			$(this).addClass("active")
			$("#sort_div select option[value='TotalBudget']").attr("selected", true);
		}
		clearInterval(myInterval);
		curSortType = $("#sort_by").val();
		visType = $(".tabs div.tab.active").first().attr("id");
		d3.selectAll(".chart > *").remove();
		
		switch(visType){
			case 'country':
				$("#sort_div").css("display", "none");
				$("#play_div").css("display", "block");
				heading = "Budgets of FIFA Development projects by countries";
				drawChoropleth();
			break;
			case 'region':
				$("#sort_div").css("display", "block");
				$("#play_div").css("display", "none");
				paramsRegionChart.height = 400;
				if(curSortType == 'n'){
					paramsRegionChart.xFeature = 'n';
					paramsRegionChart.sortItems = sortItemsNumbers;
					paramsRegionChart.xAxisText = "Projects number";
				}else{
					paramsRegionChart.xFeature = 'TotalBudget';
					paramsRegionChart.sortItems = sortItemsBudget;
				}
				heading = "Budgets of FIFA Development projects by region";
				drawBarChart(fifa_by_region_wide, paramsRegionChart);
			break;
			case 'class':
				$("#sort_div").css("display", "block");
				$("#play_div").css("display", "none");
				heading = "Budgets of FIFA Development projects by class";
				
				paramsClassChart.height = 300;
				paramsClassChart.yFeature = "Class";
				if(curSortType == 'n'){
					paramsClassChart.xFeature = 'n';
					paramsClassChart.sortItems = sortItemsNumbers;
					paramsClassChart.xAxisText = "Projects number";
				}else{
					paramsClassChart.xFeature = 'TotalBudget';
					paramsClassChart.sortItems = sortItemsBudget;
				}
				drawBarChart(fifa_by_class, paramsClassChart);
			break;
			case 'region_class':
				$("#sort_div").css("display", "none");
				$("#play_div").css("display", "none");
				heading = "Budgets of FIFA Development projects by region and class";
				drawStackedBarChart(fifa_by_region_wide, barChartParams);
			break;
		}
		$("#chart_heading").html(heading);
	}
	
	playButtonHandler = function(){
		var arrNav;
		//get all nav buttons
		arrNav = d3.selectAll(".playBackNav")[0];

		//console.log(arrNav.length);
		if(!playing){
			playing = true;
			$("#play_button").html("Stop playing");
			if(counter >= arrNav.length-1) counter = 0;
			
			showStoryElement(arrNav[counter], arrNav[counter].__data__.desc);	
			d3.select(arrNav[counter]).attr("class","playBackNav_hover");
			myInterval = setInterval(function(){
				
				d3.select(arrNav[counter]).attr("class","playBackNav");
				setTimeout(hideStoryElement(arrNav[counter]), 500);
				
				if(counter >= arrNav.length-1) {
					playing = false;
					$("#play_button").html("Play FIFA story");
					clearInterval(myInterval);
				}else{
					
					counter++;
					d3.select(arrNav[counter]).attr("class","playBackNav_hover");				
					showStoryElement(arrNav[counter], arrNav[counter].__data__.desc);	
				}
			}, 2000)
		}else{
			playing = false;
			//console.log();
			$("#play_button").html("Play FIFA story");
			setTimeout(hideStoryElement( d3.select(".playBackNav_hover")[0][0] ), 500);
			d3.select(".playBackNav_hover").attr("class","playBackNav");
			clearInterval(myInterval);
		}

    }
	
	showStoryElement = function(obj, desc){
				var circle = d3.select(obj.parentNode).select("circle"),
				svgContainerPositionLeft = $("#svgContainer").position().left,
				svgContainerPositionTop = $("#svgContainer").position().top;
				x1 = +(d3.select(obj).attr("x"));
				x1 += 10;
				y2 = circle.attr("cy");
				x2 = circle.attr("cx");
				var lineCoords = [ 
							{"x" : x1, "y" : 27},  
							{"x" : x1, "y" : y2},
							{"x" : x2, "y" : y2}];

				var line = d3.svg.line()
							  .interpolate("linear")
							  .x(function(dat) {return dat.x;})
							  .y(function(dat) {return dat.y;});
							  
				lineGraph = playBackNav.append("path")
                            .attr("stroke", "#83B51E")
                            .attr("stroke-width", 1)
                            .attr("fill", "none")
                            .attr("d", line(lineCoords));

				var totalLength = lineGraph.node().getTotalLength();

				lineGraph
				  .attr("stroke-dasharray", totalLength + " " + totalLength)
				  .attr("stroke-dashoffset", totalLength)
				  .transition()
					.delay(200)	
					.duration(200)
					.ease("linear")
					.attr("stroke-dashoffset", 0);

				circle.transition().duration(200).delay(200).attr("r",20);
				div_storyline_tip.transition()        
					.delay(200)
					.style("opacity", .9);
														
				div_storyline_tip.html('<b>'+ desc +'</b>')  
					.style("left", (+svgContainerPositionLeft + parseInt(circle.attr("cx")) + 20) + "px")     
					.style("top", (+svgContainerPositionTop + parseInt(circle.attr("cy")) - 20) + "px"); 		
	}
	
	hideStoryElement = function(obj){
		div_storyline_tip.transition().delay(2).style("opacity", 0);   
		d3.select(obj.parentNode).select("circle").transition().duration(200).attr("r",0);
		lineGraph.remove();
	}
	
	initPlayBack = function(){
		playback = svg.insert("g")
			.attr("class", "playbackContainer");
	
		playBackNav = playback.selectAll(".nav")
			.data(storyline).enter()
			.append("g")

		playBackNav.append("rect")
			.attr("class", "playBackNav")
			.attr("width", "100px")	
		  	.attr("height", "20px")
			.attr("x", function(d, i) { return ((i * 102) + 200); })
			.attr("y", 10)
			.on('mouseover', function(d) {
				if(!playing){
					showStoryElement(this, d.desc);
				}
			})		
			.on("mouseout", function(d) {   
				if(!playing){	
					hideStoryElement(this);
				}
			})
		playBackNav.append("text")
			.attr("x", function(d, i) { return ((i * 102) + 205); })
			.attr("y", 24)
			.style("fill","#FFF")
			.style("text-anchor", "start")
			.text(function(d){return d.year})
		
		playBackNav.append("circle")
           .attr("cx", function(d) {
                   return projection([d.lon, d.lat])[0];
           })
           .attr("cy", function(d) {
                   return projection([d.lon, d.lat])[1];
           })
           .attr("r", 0)
		   .attr("class", "circleMap");
	}
	
	drawChoropleth = function(){
		var quantize = d3.scale.quantize()
			.domain([0, 7000000])
			.range(d3.range(9).map(function(d,i) { return "q" + i + "-9"; }));

		var map = svg.append('g').attr('class', 'map');
		map.selectAll('path')
			.data(world_countries.features)
		  .enter()
			.append("path")
			.attr("class", function(d) { 
				var fill_class;
				if (quantize( budgetById.get(d.id) ) != undefined){
					fill_class = quantize( budgetById.get(d.id) );
				}else{
					fill_class = "fill_no_data";
				}
					
				return fill_class; 
			})
			.attr("d", path)
			.style('stroke', 'white')
			.style('stroke-width', 1)
			.on('mouseover', function(d) { 
				div_map_tip.transition()        
					.duration(200)      
					.style("opacity", .9);      
				div_map_tip.html('<b>'+d.properties.name +'</b><br>$'+text_format(budgetById.get(d.id)))  
					.style("left", (d3.event.pageX) + "px")     
					.style("top", (d3.event.pageY - 28) + "px");    
			})
			.on("mouseout", function(d) {       
				div_map_tip.transition()        
					.duration(500)      
					.style("opacity", 0);   
			});

		//–езервирование зоны дл€ playback
		initPlayBack();
		
		//легенда 
		var legend = svg.insert("g")
			.attr("transform", "translate(230, 285)")
			.attr("class", "legendContainer");
			
		var legend_bar = legend.selectAll(".legend")
			.data(quantize.range().slice().reverse())
		  .enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) { return "translate(0," + (i * 25) + ")"; });
			
		legend_bar.append("rect")
		  .attr("class", function(d){return d})
		  .attr("width", "15px")	
		  .attr("height", "25px")	
		
		legend_bar.append("text")
			.attr("x", 20)
			.attr("y", "15px")
			.style("fill","#CCC")
			.style("text-anchor", "start")
			.text(function(d){return text_format(quantize.invertExtent(d)[1])})

		var nodata = legend.append("g")
			.attr("class", "legend")
			.attr("transform", "translate(0, 225)")
		  
		nodata.append("rect")
			.attr("class", "fill_no_data")
			.attr("width", "15px")	
			.attr("height", "25px");
		  
		nodata.append("text")
			.attr("x", "20px")
			.attr("y", "15px")
			.style("fill","#CCC")
			.style("text-anchor", "start")
			.text("No data");		  
	
	    //draw left small bar charts
		//Draw top15 countries
		marginLeftBars = {top: 20, right: 10, bottom: 0, left: 10}
		//set parameters
		paramsTopCountriesChart.width = 180;
		paramsTopCountriesChart.height = 220;
		paramsTopCountriesChart.yFeature = "Country";
		paramsTopCountriesChart.xScaleType = "sqrt";
		paramsTopCountriesChart.margin = marginLeftBars;
		paramsTopCountriesChart.showAxis = false;
		paramsTopCountriesChart.labelBar = "id";
		paramsTopCountriesChart.xPosChart = 0;
		paramsTopCountriesChart.yPosChart = 10;
		paramsTopCountriesChart.chartTitle = "TOP 15 countries"
		
		//draw graph
		drawSmallBarChart(topCountries, paramsTopCountriesChart);	

		//Draw top15 projects
		//set parameters 	
		paramsTopProjectsChart.width = 180;
		paramsTopProjectsChart.height = 250;
		paramsTopProjectsChart.yFeature = "Number";
		paramsTopProjectsChart.xScaleType = "linear";
		paramsTopProjectsChart.margin = marginLeftBars;
		paramsTopProjectsChart.showAxis = false;
		paramsTopProjectsChart.labelBar = "TotalBudget";
		paramsTopProjectsChart.xPosChart = 0;
		paramsTopProjectsChart.yPosChart = 270;
		paramsTopProjectsChart.chartTitle = "TOP 15 projects";

		//draw graph
		drawSmallBarChart(topProjects, paramsTopProjectsChart);		
	
	}
	
	
	drawSmallBarChart = function(data, params){
		var xValue = function(d) { return +d[params.xFeature]; }, 
			xScale = params.xScaleType == "linear"? d3.scale.linear().range([0,params.width]) : d3.scale.sqrt().range([0,params.width]),
			xMap = function(d) { return xScale(xValue(d)); }, 
			xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(-params.height).tickFormat(params.text_format);
		
		var yValue = function(d) { return d[params.yFeature]; }, 
			yScale = d3.scale.ordinal().rangeRoundBands([0, params.height], .1),
			yMap = function(d) { return yScale(yValue(d)); }, 
			yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(0, 0);	
			
			xScale.domain([0, d3.max(data, xValue)]);
			yScale.domain(data.sort(params.sortItems).map(yValue));
		
		svg.insert("g").append("text")
			.attr("x", 5)
			.attr("y", params.yPosChart+10)
			.style("fill","steelblue")
			.style("font-size","12px")
			.style("text-anchor", "start")
			.style("padding", "10px")
			.text(params.chartTitle)				

		var bar = svg.insert("g")
			.attr("transform", "translate(0,"+params.yPosChart+")")
			.attr("class", "g_rect")
			.selectAll("g")
			.data(data).enter().append("g")
			.attr("transform", function(d, i) { return "translate(5," + (i * (yScale.rangeBand() + 2) + 20 )+ ")"; });
		bar.on('mouseover', function(d) { 
			div_left_bar_tip.transition()        
				.duration(200)      
				.style("opacity", .9);      

			if(params.yFeature == "Country"){	
				div_left_bar_tip.html('Country: <b>'+d.Country +'</b><br/>Region: <b>'+ d.Region +'</b><br/>Total budget: <b>$'+text_format(d.TotalBudget)+'</b><br>Total projects: <b>'+d.n+'</b>')  
					.style("left", (d3.event.pageX) + "px")     
					.style("top", (d3.event.pageY - 28) + "px");    
			}else{
				div_left_bar_tip.html('<b>Country: </b>'+d.Country +'<br/><b>Class: </b>'+ d.Class +'<br/><b>Description: </b>'+d["Project.Description"]+'<br><b>Approval date: </b>'+d["Project.Approval.Date"])  
					.style("left", (d3.event.pageX) + "px")     
					.style("top", (d3.event.pageY - 28) + "px"); 
			}
		})
		bar.on("mouseout", function(d) {       
			div_left_bar_tip.transition()        
				.duration(500)      
				.style("opacity", 0);   
		});	
		
		bar.append("rect")
		  .style("fill","#eee")
		  .attr("width", params.width)	
		  .attr("height", yScale.rangeBand);
		  
		var myrect = bar.append("rect")
		  .attr("class", "bar")
		  .attr("width", function(d) { return xMap(d) ; })	
		  .attr("height", yScale.rangeBand)
		
		if(params.yFeature == "Country"){	
		bar.append("text")
			.attr("x", 3)
			.attr("y", yScale.rangeBand() / 2)
			.attr("dy", ".35em")
			.text(function(d) { return d[params.labelBar]; })
			.attr("class", "barLeft");	
		}else{
		bar.append("text")
			.attr("x", 3)
			.attr("y", yScale.rangeBand() / 2)
			.attr("dy", ".35em")
			.text(function(d) { return params.text_format(d[params.labelBar]); })
			.attr("class", "barLeft");	
		
		}	
	}
	
	drawBarChart = function(data, params){
		var xValue = function(d) { return +d[params.xFeature]; }, 
			xScale = params.xScaleType == "linear"? d3.scale.linear().range([0,params.width]) : d3.scale.sqrt().range([0,params.width]),
			xMap = function(d) { return xScale(xValue(d)); }, 
			xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(-params.height).tickFormat(params.text_format);
		
		var yValue = function(d) { return d[params.yFeature]; }, 
			yScale = d3.scale.ordinal().rangeRoundBands([0, params.height], .1),
			yMap = function(d) { return yScale(yValue(d)); }, 
			yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(0, 0);	
			
			xScale.domain([0, d3.max(data, xValue)]);
			yScale.domain(data.sort(params.sortItems).map(yValue));
		
		var bar = svg.insert("g")
			.attr("transform", "translate("+params.margin.left+","+params.yPosChart+")")
			.attr("class", "g_rect")
			.selectAll("g")
			.data(data).enter().append("g")
			.attr("transform", function(d, i) { return "translate(0," + i * (yScale.rangeBand() + 2) + ")"; });
		
		var myrect = bar.append("rect")
		  .attr("class", "bar")
		  .attr("width", 0)
		  .attr("height", yScale.rangeBand);
		
		myrect.transition().duration(500)
		   .attr("width", function(d) { return xMap(d); })
		  
		
		bar.append("text")
			.attr("x", function(d) { return xMap(d)- 3; })
			.attr("y", yScale.rangeBand() / 2)
			.attr("dy", ".35em")
			.text(function(d) { return params.text_format(d[params.xFeature]); });
			
		if(params.showAxis){
			svg.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate("+params.margin.left+"," + params.height + ")")
			  .call(xAxis)
			.append("text")
			  .attr("y", 20)
			  .attr("x", params.width)
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
			  .style("font-weight", "bold")
			  .style("font-size", "15px")
			  .text(params.xAxisText);		  
		
			svg.append("g")
			  .attr("class", "axis")
			  .attr("transform", "translate("+params.margin.left+",0)")
				.call(yAxis)				
		}
	}
	
	drawStackedBarChart = function(data, params){
		var height = 400 - params.margin.top - params.margin.bottom;
		var width = 1000 - margin.left - margin.right;


		var	xScale = d3.scale.linear().range([0,width]),
			xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(-height).tickFormat(params.text_format);

		var yValue = function(d) { return d[params.yFeature]; }, 
			yScale = d3.scale.ordinal().rangeRoundBands([0, height], .1),
			yMap = function(d) { return yScale(yValue(d)); }, 
			yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(0, 0);	

		var color = d3.scale.ordinal()
			.range(["#006600", "#FF9900", "#CC0000", "#990066", "#333399", "#99CCFF", "#339900", "#FF6600"]);		
	    color.domain(d3.keys(data[0]).reverse().filter(function(key) { return key !== "Region" && key !== "n" && key !== "TotalBudget" && key !== "classes" && key !== "total"; }));
		
	    data.forEach(function(d) {
			var x0 = 0;
			d.classes = color.domain().map(function(name) { return {name: name, x0: x0, x1: x0 += +d[name]}; });
			d.total = d.classes[d.classes.length - 1].x1;
    	});

	    data.sort(params.sortItems);

		xScale.domain([0, d3.max(data, function(d) { return d.total; })]);
		yScale.domain(data.map(function(d) { return d.Region; }));

	  
		var region = svg.selectAll(".state")
			.data(data)
		  .enter().append("g")
			.attr("class", "bar")
    		.attr("transform", function(d, i) { return "translate("+params.margin.left+"," + (i * (yScale.rangeBand() + 2) +10) + ")"; });	
 
	    var myrect = region.selectAll("rect")
		    .data(function(d) { return d.classes; })
		  .enter().append("rect")
			.attr("x", 0)
			.attr("width", 0)		
		    .attr("height", yScale.rangeBand())
		    .style("fill", function(d) { return color(d.name); })
		    .on('mouseover', function(d) { 
				div_map_tip.transition()        
					.duration(200)      
					.style("opacity", .9);      
				div_map_tip.html('<b>'+d.name +'</b><br/>'+'$'+params.text_format(d.x1-d.x0))  
					.style("left", (d3.event.pageX) + "px")     
					.style("top", (d3.event.pageY - 28) + "px");    
			})
		    .on("mouseout", function(d) {       
				div_map_tip.transition()        
					.duration(500)      
					.style("opacity", 0);   
			});
		  
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate("+margin.left+"," + height + ")")
			.call(xAxis)
			
		.append("text")
			.attr("y", 20)
			.attr("x", width)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.style("font-weight", "bold")
			.style("font-size", "15px")
			.text("Total budget ($)");		  
	
		svg.append("g")
		  .attr("class", "axis")
		  .attr("transform", "translate("+margin.left+",0)")
    		.call(yAxis)
			
		var legend = svg.selectAll(".legend")
			.data(color.domain().slice())
		  .enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) { return "translate(0," + (i * 20+10) + ")"; });

		legend.append("rect")
			.attr("x", width+margin.right+margin.left-20)
			.attr("y", height - 180)
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", color)

		legend.append("text")
			.attr("x", width+margin.right+margin.left-26)
			.attr("y", height - 171)
			.attr("dy", ".35em")
			.style("text-anchor", "end")
			.style("fill", "#000")
			.text(function(d) { return d; });	
		
		myrect.transition().duration(500)
			.attr("x", function(d) { return xScale(d.x0); })
			.attr("width", function(d) { return xScale(d.x1) - xScale(d.x0); })
	}

	return {
		init: init,
		selectGraph: selectGraph,
		playButtonHandler: playButtonHandler
	}
}());

