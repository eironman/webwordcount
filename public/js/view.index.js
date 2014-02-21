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
		
		var url = $("#url").val();
		var urlRegexp = /^(?:https?:\/\/)?(?:[\w]+\.)([a-zA-Z\.]{2,6})([\/\w\.-]*)*\/?$/;
		
		// Validate url
		if ( url != '' && urlRegexp.test(url) ){
			
			resetResult();
			
			// Add requested url
			$("#urls-requested").append('<li class="active"><a href="">' + url + '</a></li>');
			
			// Do the request
			$.ajax({
				url: '/count/' + url
			}).done(function(words){
				
				$(".loading").addClass('hidden');
				$("#result tbody").html('');
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
				$("#result tbody").html('');
				$(words).each(function(index){
					
					if (words[index].w.length > length) {
						
						$("#result tbody").append(
							'<tr>' +
								'<td>' + words[index].w + '</td>' +
								'<td>' + words[index].c + '</td>' +
								'<td>' + words[index].text + '</td>' +
								'<td>' + words[index].ptitle + '</td>' +
								'<td>' + words[index].desc + '</td>' +
								'<td>' + words[index].keyw + '</td>' +
								'<td>' + words[index].heading + '</td>' +
							'</tr>')
						count++;
					}
				});
				$('.page-header > span').html(count);
				$("#result th.total").addClass('sorttable_sorted_reverse');
				
			}).error(function(){
				$(".loading").addClass('hidden');
			});
		}
	});
});

/**
 * Resets the results
 */
function resetResult(){
	$(".loading").removeClass('hidden');
	$("#result th").removeClass('sorttable_sorted sorttable_sorted_reverse');
	$("#result tbody").html(
		'<tr><td>-</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>');
	$("#urls-requested").html('');
	$('.page-header > span').html(0);
}









