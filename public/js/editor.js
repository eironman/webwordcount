$(function(){
	
	editor = new EditorView();
	if ( $("#text-editor").val() != '' ){
		editor.parse();
	}
	
	// Clear editor content
	$("#clear").click(function(){
		$("#text-editor").val('');
		editor.parse();
		editor.synonymlist.reset();
	});
});