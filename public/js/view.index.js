$(function(){
	
	// Menu action
	$('ul.dropdown-menu > li').on('click', function(){
		$('ul.dropdown-menu > li.disabled').removeClass('disabled');
		$(this).addClass('disabled');
		$('li.dropdown > a > span').html($(this).children('a').html());
		$("#form-count").submit();
	})
	
	// Request form
	$("#form-count").on('submit', function(e){
		e.preventDefault();
		console.info('uep');
		var url = $("#url").val();
		if ( url != '' ){
			
			resetResult();
			
			// Add requested url
			$("#urls-requested").append('<li class="active"><a href="">' + url + 
										' <img src="/img/loading.gif" id="loading"></a></li>')
			
			// Do the request
			$.ajax({
				url: '/count/' + url
			}).done(function(words){
				
				var count=0, length=0;
				
				// Length filter
				var filter = $('ul.dropdown-menu > li.disabled').attr('id');
				if (filter == 'no-filter') {
					length = 0;
				} else if (filter == 'filter-one'){
					length = 1;
				} else if (filter == 'filter-two'){
					length = 2;
				} else if (filter == 'filter-three'){
					length = 3;
				}
				
				// Show result
				$("#loading").remove();
				$("#result tbody").html('');
				$(words).each(function(index){
					
					if (words[index].w.length > length) {
						
						$("#result tbody").append(
							'<tr>' +
							'<td>' + words[index].w + '</td>' +
							'<td>' + words[index].c + '</td>' +
							'<td>' + words[index].text + '</td>' +
							'<td>' + words[index].ptitle + '</td>' +
							//'<td>' + words[index].titles + '</td>' +
							'<td>' + words[index].desc + '</td>' +
							'<td>' + words[index].keyw + '</td>' +
							'</tr>')
						count++;
					}
				});
				$('.page-header > span').html(count);
				
			}).error(function(){
				$("#loading").remove();
				resetResult();
			});
		}
	});
});

/**
 * Resets the results
 */
function resetResult(){
	$("#result tbody").html('<tr><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>')
	$("#urls-requested").html('');
	$('.graphic').html('');
	$('.page-header > span').html('-');
}









