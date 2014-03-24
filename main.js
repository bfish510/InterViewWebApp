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
		if($(element).hasClass("questionSelectorArrow"))
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

function updateClickEvents(){
	$(".moveUp").click(function(){
		var thisQuestion = $(this).siblings(".questionText");
		var swapWithQuestion = $(this).parent().prev(".formatQuestionContainer").children(".questionText");

		if(swapWithQuestion.size() != 0)
		{
			var textSwap = thisQuestion.text();
			thisQuestion.text(swapWithQuestion.text())
			swapWithQuestion.text(textSwap);
		}

	});
	$(".moveDown").click(function(){
		var thisQuestion = $(this).siblings(".questionText");
		var swapWithQuestion = $(this).parent().next(".formatQuestionContainer").children(".questionText");

		if(swapWithQuestion.size() != 0)
		{
			var textSwap = thisQuestion.text();
			thisQuestion.text(swapWithQuestion.text())
			swapWithQuestion.text(textSwap);
		}
	});
	$(".formatQuestionContainer").addClass("pageBreak");
	$(".formatQuestionContainer").last().removeClass("pageBreak");
}

$(document).ready(function()
{
	$("#searchField").on('input', function() {
		if($.trim($("#searchField").val()).length == 0){
			$(".questionPack").each(function(){
				$(this).fadeIn( "slow" );
			});
			$(".question").each(function(){
				$(this).fadeIn( "slow" );
			});
		}
		else{
			$(".questionPackLabel:Contains(" + $.trim($("#searchField").val()) + ")").each(function(){
				$(this).parents(".questionPack").fadeIn( "slow" );
			});
			$(".questionLabel:Contains(" + $.trim($("#searchField").val()) + ")").each(function(){
				$(this).parents(".question").fadeIn( "slow" );
				$(this).parents(".questionPack").fadeIn( "slow" );
			});
			$(".questionPackLabel").not(":Contains("+ $.trim($("#searchField").val()) +")").each(function(){
				var notFaded = false;
				var parent = $(this).parent();
				var next = parent.next(".questionPackQuestions");
				var questionLabels = next.children(".question").children(".questionSelector").children(".questionLabel");
				
				questionLabels.each(function(){
					var contain = $(this).is(":Contains("+ $.trim($("#searchField").val()) +")");
					if(contain)
					{
						notFaded = true;
					}
					else
					{
						$(this).parents(".question").fadeOut("slow");
					}
				});

				if(!notFaded)
				{
					$(this).parents(".questionPack").fadeOut( "slow" );
				}
			});
		}
	});
	$(".questionPackContainer").click(function()
	{
		toggleChildren(this);
		updateArrow(this);
	});
	
	$(".useQuestion").click(function(){
		var value = 0;
		var checked = 0;
		$(".useQuestion").each(function(){
			if($(this).is(':checked'))
			{
				checked += 1;
				$(this).parent().next().children(".timeToComplete").each(function(){
					value += parseInt($(this).text());
				});
			}
		});
		
		var hours = Math.floor( value / 60);
		var min = value % 60;
		$("#totalTime").text(hours + " hours and " + min + " minutes");
		$("#numQuestions").text(checked);
	});
	$(".continueButton").click(function(){
		var empty = true;
		$("#centerArea").fadeOut("slow", function(){
			$("#formatExam").fadeIn("slow");
		});
		$("#formatQuestionArea").empty();
		var index = 0;
		$(".useQuestion").each(function(){
			if($(this).is(':checked'))
			{
				index += 1;
				empty = false;
				$("#formatQuestionArea").append("<div class=\"formatQuestionContainer\"><span>" + index + ". </span><span class=\"questionText\">" + $(this).next().text() + "</span><br /><input class=\"moveUp\" type=\"button\" value=\"Move Up\" /> <input class=\"moveDown\" type=\"button\" value=\"Move down\"/><br/><br/></div>");
				
			}
		});
		if(empty)
		{
			$("#formatQuestionArea").append("<span>There are no questions here. Go back and add some or go to our store to add some to your account!</span>");
		}
		updateClickEvents();
	});
	$("#formatExam > .completion > .backButton").click(function(){
		$("#formatExam").fadeOut("slow", function(){
			$("#centerArea").fadeIn("slow");
		});
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

	/*
	$(".questionSelectorArrow").click(function()
	{
		toggleChildren(this);
		updateArrow(this);
	});
	*/
});
