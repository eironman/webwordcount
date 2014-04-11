$(function(){

	/**
	 * Text editor view
	 */
	EditorView = Backbone.View.extend({
		
		el: '#text-editor',
		
		wordlist: new WordListView(),
		synonymlist: new SynonymListView(),
		filter: new EditorFilterView(),
		
		events:{
			'keyup' : 'parse'
		},
		
		model: new EditorModel(),
		
		parse: function(){
			this.model.parse(this.$el.val());
			this.wordlist.model = this.model;
			this.synonymlist.model = this.model;
			this.render();
		},
		
		render: function(){
			$("#paragraph-count").html(this.model.getParagraphCount());
			$("#unique-words-count").html(this.model.getUniqueWordCount());
			$("#words-count").html(this.model.getWordCount());
			$("#words-more-one-letter-count").html(this.model.getMoreOneLetterWordCount());
			$("#words-more-two-letters-count").html(this.model.getMoreTwoLettersWordCount());
			$("#words-more-three-letters-count").html(this.model.getMoreThreeLettersWordCount());
			this.wordlist.render();
		}
	});
});