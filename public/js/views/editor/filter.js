$(function(){
	
	/**
	 * Editor filter view
	 */
	EditorFilterView = Backbone.View.extend({
		
		ignoreWords	: [],
		
		el: '#editor-filter',
		
		events: {
			'keyup #ignore-words' : 'filter'
		},
		
		filter: function(){
			this.getWordsToIgnore();
			editor.parse()
		},
		
		/**
		 * Gets the words the user wants to ignore
		 */
		getWordsToIgnore: function(){
			
			// String of words to ignore
			var ignore = $("#ignore-words").val();
			
			// Remove parenthesis, commas, points, ...
			ignore = ignore.replace(editor.model.get('forbidcharRegexp'), ' ');

			// Remove extra whitespaces
			ignore = ignore.toLowerCase().replace(editor.model.get('whitespaceRegexp'), ' ');
			
			this.ignoreWords = ignore.split(' ');
		}
	});
});