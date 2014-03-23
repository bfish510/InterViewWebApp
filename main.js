jQuery.expr[":"].Contains = jQuery.expr.createPseudo(function(arg) {
    return function( elem ) {
        return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

function updateArrow(element) {
	var selected = $(element).children(".arrow");
	if( selected.hasClass("arrow-right") )
	{
		selected.removeClass("arrow-right");
		selected.addClass("arrow-down");
	}
	else if( selected.hasClass("arrow-down") )
	{
		selected.removeClass("arrow-down");
		selected.addClass("arrow-right");
	}
}

function toggleChildren(element) {
	if($(element).hasClass("questionPackContainer"))
	{
		$(element).siblings(".questionPackQuestions").toggle();
	}
	else
	{
		if($(element).hasClass("questionSelector"))
		{
			$(element).siblings(".questionData").toggle();
		}
	}
}

function makeCircle(element, percent){
	//Width and height
	var w = 100;
	var h = 100;

	var dataset = [ percent, (100-percent) ];

	var outerRadius = w / 2;
	var innerRadius = 0;
	var arc = d3.svg.arc()
					.innerRadius(innerRadius)
					.outerRadius(outerRadius);
	
	var pie = d3.layout.pie();
	
	//Easy colors accessible via a 10-step ordinal scale
	var color = d3.scale.category10();

	//Create SVG element
	var svg = d3.select(element)
				.append("svg")
				.attr("width", w)
				.attr("height", h);
	
	//Set up groups
	var arcs = svg.selectAll("g.arc")
				  .data(pie(dataset))
				  .enter()
				  .append("g")
				  .attr("class", "arc")
				  .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
	
	//Draw arc paths
	arcs.append("path")
	    .attr("fill", function(d, i) {
	    	return color(i);
	    })
	    .attr("d", arc);
	
	//Labels
	arcs.append("text")
	    .attr("transform", function(d) {
	    	return "translate(" + arc.centroid(d) + ")";
	    })
	    .attr("text-anchor", "middle")
	    .text(function(d) {
	    	return d.value;
	    });
}

$(document).ready(function()
{
	$("#searchField").on('input', function() {
		if($.trim($("#searchField").val()).length == 0){
			$(".questionPackContainer").each(function(){
				$(this).css('background-color', '#CCCCCC');
			});
		}
		else{
			$(".questionPackLabel:Contains(" + $.trim($("#searchField").val()) + ")").each(function(){
				$(this).parent().css('background-color', 'green');
			});
			$(".questionPackLabel").not(":Contains("+ $.trim($("#searchField").val()) +")").each(function(){
				$(this).parent().css('background-color', '#CCCCCC');
			});
		}
	});
	$(".questionPackContainer").click(function()
	{
		toggleChildren(this);
		updateArrow(this);
	});
	$(".questionSelector").click(function()
	{
		toggleChildren(this);
		updateArrow(this);
	});
	/*
	$(".percentCorrectGraph").each(function(){
		var data = this.getAttribute("data-percentCorrect");
		makeCircle(this, data);
	});
	<div class="percentCorrectGraph" data-percentCorrect="80">
		<span>% who answered correct</span><br/>
	</div>
	*/
});
