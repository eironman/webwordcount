$(function(){

	/**
	 * Request view
	 */
	RequestView = Backbone.View.extend({
		
		// Result list
		el: '#result tbody',

		initialize: function(){
			// Actions depending on the model changes
			this.listenTo(this.model, "change:fetched", this.render);
			this.listenTo(this.model, "change:requestedUrl", this.renderUrl);
		},
		
		// Renders url in the list
		renderUrl: function(){
			var template = _.template($('#url-list').html(), {url: this.model.get('requestedUrl')});
			$("#urls-requested").append(template);
		},
		
		// Renders the list of words
		render: function(){
			
			// Only render if fetched is true
			if ( !this.model.get('fetched') ){
				return;
			}
			
			$(".loading").addClass('hidden');
			var count=0, lengthFilter=0, filteredWords=[];
			
			// Words list
			var words = this.model.get('words');
			
			// Length filter
			var filter = $('ul.dropdown-menu > li.disabled').attr('id');
			if (filter == 'no-filter') {
				lengthFilter = 0;
			} else if (filter == 'filter-one'){
				lengthFilter = 1;
			} else if (filter == 'filter-two'){
				lengthFilter = 2;
			} else if (filter == 'filter-three'){
				lengthFilter = 3;
			}
			
			// Empty table
			$("#result tbody").html('');
			
			// Apply filter to list
			_.each(words, function(word){
				if (word.w.length > lengthFilter) {
					filteredWords.push(word);
					count++;
				}
			});
			
			// Html list template
			var params = {list: filteredWords};
			var template = _.template($('#word-list').html(), params);
			
			// Show result
            this.$el.html(template);
			$('.page-header > span').html(count);
			
			// By default is sorted by total count
			$("#result th").removeClass('sorttable_sorted sorttable_sorted_reverse');
			$("#result th.total").addClass('sorttable_sorted_reverse');
			
			// Set the trigger to its original value
			this.model.set('fetched', false);
		}
	});
});