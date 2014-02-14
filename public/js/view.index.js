$(function(){
	$("#form-count").on('submit', function(e){
		e.preventDefault();
		
		var url = $("#url").val();
		if ( url != '' ){
			
			// Show loading
			$("#loading").toggleClass('hidden');
			
			// Reset list
			$("#result tbody").html('');
			$("#urls-requested").html('');
			
			// Add requestd url
			$("#urls-requested").append('<li class="active"><a href="">' + url + '</a></li>')
			
			// Do the request to count words
			$.ajax({
				url: '/count/' + url
			}).done(function(words){
				
				// Show result
				$("#loading").toggleClass('hidden');
				$(words).each(function(index){
					$("#result tbody").append('<tr><td>' + words[index].w + '</td><td>' + words[index].c + '</td></tr>')
				});
				
			}).error(function(){
				$("#loading").toggleClass('hidden');
				$("#result tbody").append('<tr><td>-</td><td>-</td></tr>')
			});
		}
	});
});