$(function(){

	/**
	 * Word list view
	 */
	WordListView = Backbone.View.extend({
		
		el: '#words-text',
		
		events: {
			'click a' : 'synonims'
		},
		
		// Shows the synonims of a word
		synonims: function(e){
			e.preventDefault();
			
			alert('Synonims');
;		},
		
		// Renders words
		render: function(){
			var template = _.template($('#words-list').html(),
							{list: this.model.get('collection').models});
			this.$el.html(template);
		}
	});
});