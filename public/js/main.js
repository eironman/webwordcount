$(function(){
	
	// Focus the textbox
	$("#url").focus();
	
	// Menu action
	$('ul.dropdown-menu > li').on('click', function(){
		$('ul.dropdown-menu > li.disabled').removeClass('disabled');
		$(this).addClass('disabled');
		$('li.dropdown > a > span').html($(this).children('a').html());
		$("#form-count").submit();
	})
	
	var form = new FormView();
});