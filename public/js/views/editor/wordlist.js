$(function(){

	/**
	 * Word list view
	 */
	WordListView = Backbone.View.extend({
		
		el: '#words-text',
		
		// Renders words
		render: function(){
			var template = _.template($('#words-list').html(),
							{list: this.model.get('collection').models});
			this.$el.html(template);
		}
	});
});