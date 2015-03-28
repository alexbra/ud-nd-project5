function changeBar(){
	var order, source, w, h, column, row, url;
	
	if($(this).hasClass("tab") ){
		$(".tabs div.tab.active").removeClass("active")
		$(this).addClass("active")
	}
	source = $(".tabs div.tab.active").first().attr("id");
	column = $("#sort_by").val();

	switch(source){
		case 'country':
			w = 800;
			h = 700;
			row = "Country";
			url = "data/fifa_by_country.csv"
			heading = "Countries with TOP 30 budgets of FIFA Development projects"
		break;
		case 'region':
			w = 800;
			h = 400;
			row = "Region";
			url = "data/fifa_by_region.csv"
			heading = "Budgets of FIFA Development projects by region"
		break;
		case 'class':
			w = 800;
			h = 400;
			row = "Class";
			url = "data/fifa_by_class.csv"
			heading = "Budgets of FIFA Development projects by class"
		break;

	}
	d3.selectAll(".chart > *").remove();
	if(source == "region_class"){
	heading = "Budgets of FIFA Development projects by region and class"
	drawStackedBarChart(heading)
	}
	else
	drawBarChart(w,h,column,row,url,heading);
}


function drawStackedBarChart(heading){
	$("#chart_heading").html(heading)
	$("#sort_div").css("display", "none")
	var margin = {top: 20, right: 110, bottom: 30, left: 150},
		width = 800 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;	
		
	var	xScale = d3.scale.linear().range([0,width]),
		xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(-height);

	var yValue = function(d) { return d.Region; }, 
		yScale = d3.scale.ordinal().rangeRoundBands([0, height], .1),
		yMap = function(d) { return yScale(yValue(d)); }, 
		yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(0, 0);	

	var color = d3.scale.ordinal()
		.range(["#006600", "#FF9900", "#CC0000", "#990066", "#333399", "#339900", "#99CCFF", "#FF6600"]);		

	var text_format = d3.format(",d")
	var chart = d3.select(".chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)		

	d3.csv("data/fifa_by_region_wide.csv", function(error, data) {
	  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Region"; }));

	  data.forEach(function(d) {
		var x0 = 0;
		d.classes = color.domain().map(function(name) { return {name: name, x0: x0, x1: x0 += +d[name]}; });
		d.total = d.classes[d.classes.length - 1].x1;
	  });

	  data.sort(function(a, b) { return b.total - a.total; });

	  xScale.domain([0, d3.max(data, function(d) { return d.total; })]);
	  yScale.domain(data.map(function(d) { return d.Region; }));

	  
	var region = chart.selectAll(".state")
		  .data(data)
		.enter().append("g")
		  .attr("class", "bar")
		 .attr("transform", function(d, i) { return "translate("+margin.left+"," + (i * (yScale.rangeBand() + 2) +10) + ")"; });	
 
	  myrect = region.selectAll("rect")
		  .data(function(d) { return d.classes; })
		.enter().append("rect")
			.attr("x", 0)
			.attr("width", 0)		
		  .attr("height", yScale.rangeBand())
		  .style("fill", function(d) { return color(d.name); });
		
		chart.append("g")
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
	
		chart.append("g")
		  .attr("class", "axis")
		  .attr("transform", "translate("+margin.left+",0)")
			.call(yAxis)
			
		 var legend = chart.selectAll(".legend")
			  .data(color.domain().slice().reverse())
			.enter().append("g")
			  .attr("class", "legend")
			  .attr("transform", function(d, i) { return "translate(0," + (i * 20+10) + ")"; });

		  legend.append("rect")
			  .attr("x", width+margin.right+margin.left-20)
			  .attr("width", 18)
			  .attr("height", 18)
			  .style("fill", color);

		  legend.append("text")
			  .attr("x", width+margin.right+margin.left-26)
			  .attr("y", 9)
			  .attr("dy", ".35em")
			  .style("text-anchor", "end")
			  .style("fill", "#000")
			  .text(function(d) { return d; });	
		
		myrect.transition().duration(500)
			.attr("x", function(d) { return xScale(d.x0); })
			.attr("width", function(d) { return xScale(d.x1) - xScale(d.x0); })
	});		
		
}


function drawBarChart(w,h,column,row,url,heading){
	$("#chart_heading").html(heading)
	$("#sort_div").css("display", "block")
	var margin = {top: 20, right: 0, bottom: 30, left: 150},
		width = w - margin.left - margin.right,
		height = h - margin.top - margin.bottom;
	
	var xValue = function(d) { return d[column]; }, 
		xScale = d3.scale.linear().range([0,width]),
		xMap = function(d) { return xScale(xValue(d)); }, 
		xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(-height);
	
	var yValue = function(d) { return d[row]; }, 
		yScale = d3.scale.ordinal().rangeRoundBands([0, height], .1),
		yMap = function(d) { return yScale(yValue(d)); }, 
		yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(0, 0);
	
	var text_format = d3.format(",d")
	var chart = d3.select(".chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	
	//d3.ascending(a.letter, b.letter) // > для сортировки по имени
	var sortItems = function(a,b) { return +b[column] - +a[column] }
	
	d3.csv(url, type, function(error, data) {
		xScale.domain([0, d3.max(data, xValue)]);
		yScale.domain(data.sort(sortItems).map(yValue));
	
		var bar = chart.insert("g")
			.attr("transform", "translate("+margin.left+",10)")
			.selectAll("g")
			.data(data).enter().append("g")
			.attr("transform", function(d, i) { return "translate(0," + i * (yScale.rangeBand() + 2) + ")"; });
		
		bar.append("rect")
		  .attr("class", "bar")
		  .attr("width", function(d) { return xMap(d); })
		  .attr("height", yScale.rangeBand);
	
		bar.append("text")
			.attr("x", function(d) { return xMap(d)- 3; })
			.attr("y", yScale.rangeBand() / 2)
			.attr("dy", ".35em")
			.text(function(d) { return text_format(d[column]); });
			
		chart.append("g")
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
	
		chart.append("g")
		  .attr("class", "axis")
		  .attr("transform", "translate("+margin.left+",0)")
			.call(yAxis)		
	});
	
	function type(d) {
	  d[column] = +d[column];
	  return d;
	}	
}