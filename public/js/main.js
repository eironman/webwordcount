$(function(){
	
	// Focus the textbox
	$("#url").focus();
	
	// Menu action
	$('ul.dropdown-menu > li').on('click', function(){
		$('ul.dropdown-menu > li.disabled').removeClass('disabled');
		$(this).addClass('disabled');
		$('li.dropdown > a > span').html($(this).children('a').html());
		if ( $("#url").val() != '' ) $("#form-count").submit();
	})
	
	// Export to csv
	$("#csv").click(function(){
		
		var data = 'data:text/csv;charset=utf-8,';
		var words = [];
		
		// Headings
		$("#result th").each(function(){
			words.push($(this).html().replace(" ", "_"));
		});
		data += words.join(";") + "\n";
		
		// Words
		$("#result tr").each(function(){
			words = [];
			$(this).children("td").each(function(){
				words.push($(this).html());				
			});
			data += words.join(";") + "\n";
		});
		
		var encodedUri = encodeURI(data);
		window.open(encodedUri);
	})
	
	var form = new FormView();
});