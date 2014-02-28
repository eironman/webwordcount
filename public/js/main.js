$(function(){
	
	// Menu action
	$('ul.dropdown-menu > li').on('click', function(){
		$('ul.dropdown-menu > li.disabled').removeClass('disabled');
		$(this).addClass('disabled');
		$('li.dropdown > a > span').html($(this).children('a').html());
		$("#form-count").submit();
	})
	
	// Request model and view
	var requestM = new Request();
	var defaultV = new DefaultView({model: requestM});
	var requestV = new RequestView({model: requestM});
	
	// Request form
	$("#form-count").on('submit', function(e){
		e.preventDefault();
		requestM.doRequest($("#url").val());
	});
});