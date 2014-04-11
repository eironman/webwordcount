$(function(){

	/**
	 * Synonym list view
	 */
	SynonymListView = Backbone.View.extend({
		
		el: '#words-text',
		
		// WordModel selected to show the synonyms
		// The actual model of the view is the editor
		wordSelected: null,
		
		events: {
			'click a' : 'synonyms'
		},
		
		// Gets the synonyms of a word
		synonyms: function(e){
			e.preventDefault();
			
			this.showLoading();
			
			// Find the model selected
			var word = $(e.currentTarget).children().html();
			var wordModels = this.model.get('collection').models;
			this.wordSelected = _(wordModels).find(function(model){
				return model.get('text') == word;
			});
			
			// Get the synonyms and render
			if (typeof this.wordSelected != 'undefinded') {
				
				if ( this.wordSelected.get('fetched') ){
					this.render();
				} else {
					this.wordSelected.getSynonyms();
					this.listenToOnce(this.wordSelected, "change:fetched", this.render);
				}
			}
		},
		
		showLoading: function(){
			$("#synonyms .list").hide();
			$("#synonyms .loading").removeClass('hidden');
		},
		
		hideLoading: function(){
			$("#synonyms .loading").addClass('hidden');
			$("#synonyms .list").show();
		},
		
		// Renders synonyms
		render: function(){

			this.hideLoading();
			var synonyms = this.wordSelected.get('synonyms');
			if (synonyms.length === 0) {
				$("#synonyms .list").html('No synonyms found for ' + this.wordSelected.get('text'));
			} else {
				$("#synonyms .list").html(synonyms.join(', '));
			}
			/*var template = _.template($('#words-list').html(),
							{list: this.model.get('collection').models});
			this.$el.html(template);*/
		}
	});
});