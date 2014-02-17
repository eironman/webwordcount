$(function(){
	$("#form-count").on('submit', function(e){
		e.preventDefault();
		
		var url = $("#url").val();
		if ( url != '' ){
			
			// Reset list
			$("#result tbody").html('');
			$("#urls-requested").html('');
			$('.graphic').html('');
			
			// Add requeste	d url
			$("#urls-requested").append('<li class="active"><a href="">' + url + 
										' <img src="/img/loading.gif" id="loading"></a></li>')
			
			// Do the request to count words
			$.ajax({
				url: '/count/' + url
			}).done(function(words){
				
				// Show result
				$("#loading").remove();
				$(words).each(function(index){
					
					if (index == 0) {
						$('.graphic.typea').append('<div>' + words[index].c + '</div>')
						$('.graphic.typea').append('<h4>' + words[index].w + '</h4>')
					} else if (index == 1){
						$('.graphic.typeb').append('<div>' + words[index].c + '</div>')
						$('.graphic.typeb').append('<h4>' + words[index].w + '</h4>')
					} else if (index == 2){
						$('.graphic.typec').append('<div>' + words[index].c + '</div>')
						$('.graphic.typec').append('<h4>' + words[index].w + '</h4>')
					} else if (index == 3){
						$('.graphic.typed').append('<div>' + words[index].c + '</div>')
						$('.graphic.typed').append('<h4>' + words[index].w + '</h4>')
					} else {
						$("#result tbody").append('<tr><td>' + words[index].w + '</td><td>' +
													words[index].c + '</td></tr>')
					}
				});
				
			}).error(function(){
				$("#loading").remove();
				$("#result tbody").append('<tr><td>-</td><td>-</td></tr>')
			});
		}
	});
});