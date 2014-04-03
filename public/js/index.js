$(function(){
	
	form = new FormView();
	
	// Focus the textbox
	$("#url").focus();
	
	// Export to csv
	$("#csv").click(function(){
		form.exportResult();
	});
});