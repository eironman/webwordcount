$(function(){

	/**
	 * Urls requested View
	 */
	UrlsRequestedView = Backbone.View.extend({
		
		el: '#urls-requested',
		
		events: {
			'click a' : 'showResult'
		},
		
		// Shows the result of a selected url
		showResult: function(e){
			e.preventDefault();
			
			// Url selected
			var url = $(e.currentTarget).html();

			// Show the result
			form.submit(url);
		},
		
		// Renders urls
		render: function(){
			var template = _.template($('#url-list').html(), {list: this.collection.models});
			this.$el.html(template);
		}
	});
});