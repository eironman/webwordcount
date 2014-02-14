$(function(){
	$("#form-count").on('submit', function(e){
		e.preventDefault();
		
		// Reset list
		$("#result").html('');
		
		// Show loading
		$("#loading").toggleClass('hidden');
		
		// Do the request to count words
		$.ajax({
			url: '/count/' + $("#url").val()
		}).done(function(words){
			
			// Hide loading
			$("#loading").toggleClass('hidden');
			
			// Show result
			$(words).each(function(index){
				$("#result").append('<li>' + words[index].w + ': ' + words[index].c + '</li>')
			});
			
		}).error(function(){
			// Hide loading
			$("#loading").toggleClass('hidden');
		});
	});
});