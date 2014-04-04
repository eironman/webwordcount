$(function(){

	/**
	 * Result View
	 */
	ResultView = Backbone.View.extend({
		
		// Result list
		el: '#result tbody',

		// Renders the list of words
		render: function(){
			
			// Remove url from input
			$("#url").val('').focus();
			$(".loading").addClass('hidden');
			
			// Only render if the model has fetched the data
			if ( !this.model.get('fetched') ){
				return;
			}
			
			var count=0, filteredWords=[];
			
			// Words list
			var words = this.model.get('words');
			
			// Length filter
			var lengthFilter = form.getLengthFilter();
			
			// Apply filter to list
			_.each(words, function(word){
				if (word.w.length > lengthFilter) {
					filteredWords.push(word);
					count++;
				}
			});
			
			// Html list template
			var template = _.template($('#word-list').html(), {list: filteredWords});

			// Show result
            this.$el.html(template);
			$('.page-header > span').html(count);
			//form.options.urls.updateUrlCount(this.model.get('requestedUrl'), words.length);
			
			// By default is sorted by total count
			$("#result th").removeClass('sorttable_sorted sorttable_sorted_reverse');
			$("#result th.total").addClass('sorttable_sorted_reverse');
		},
		
		exportToCSV: function(){
			
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
		}
	});
});