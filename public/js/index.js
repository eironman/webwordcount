$(function(){
	
	// Focus the textbox
	$("#url").focus();
	
	// Export to csv
	$("#csv").click(function(){
		
		var data = 'data:text/csv;charset=utf-8,';
		var words = [];
		
		// Headings
		$("#result th").each(function(){
			words.push($(this).html().replace(" ", "_"));
		});
		data += words.join(",") + "\n";
		
		// Words
		$("#result tr").each(function(){
			words = [];
			$(this).children("td").each(function(){
				words.push($(this).html());				
			});
			data += words.join(",") + "\n";
		});
		
		var encodedUri = encodeURI(data);
		window.open(encodedUri);
	})
	
	var form = new FormView();
});