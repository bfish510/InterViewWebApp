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
	$(element).siblings(".questionPackQuestions").children(".question").each(function(){$(this).toggle()});
}

$(document).ready(function()
{
	$(".questionPackContainer").click(function()
	{
		toggleChildren(this);
	});
	$(".questionPackContainer").click(function()
	{
		updateArrow(this);
	});
	$(".question").click(function()
	{
		updateArrow(this);
	});
});
