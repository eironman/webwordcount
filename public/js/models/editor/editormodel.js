$(function(){
	
	/**
	 * Text editor model
	 */
	EditorModel = Backbone.Model.extend({
		
		defaults: {
			wordcount			: 0,
			uniquewordcount		: 0,
			onelettercount		: 0,
			twoletterscount		: 0,
			threeletterscount	: 0,
			paragraphcount		: 0,
			collection			: new WordCollection(),
			forbidcharRegexp	: /([\;(\),\.:\[\]\{\}=\?¿\"#<>\-!¡/'_]+)|(^|\s|,|\.)'|'($|\s|\.|,)/g,
			paragraphRegexp		: /(\n *[^\s])/g,
			whitespaceRegexp	: /(\s+)/g
		},
		
		/**
		 * Parse text and extract data
		 */
		parse: function(text){
			
			// Reset the collection
			this.set('collection', new WordCollection());
			
			text = text.trim();
			if (text.trim() != '') {
				
				// Count paragraphs
				var count = 1;
				while (this.get('paragraphRegexp').exec(text) !== null) count++;
				this.set('paragraphcount', count);
				
				// Replace parenthesis, commas, points, ...
				text = text.replace(this.get('forbidcharRegexp'), ' ');
	
				// Remove extra whitespaces, tabs and line breaks
				text = text.toLowerCase().replace(this.get('whitespaceRegexp'), ' ').trim();
				
				// Array of words
				text = text.split(' ');
				
				// Create the word collection
				var model, unique=0, count=0, oneletter=0, twoletters=0, threeletters=0;
				var collection = this.get('collection');
				var ignore = editor.filter.ignoreWords;
				_(text).each(function(word){
					
					// Is a word to ignore?
					if (ignore.indexOf(word) == -1){
						
						model = collection.findWhere({text: word});
						if ( typeof model != "undefined" ){
							model.addOneCount();
						} else {
							unique++;
							collection.add(new WordModel({text : word}), [{sort: false}]);
							if (word.length > 1) oneletter++;
							if (word.length > 2) twoletters++;
							if (word.length > 3) threeletters++;
						}
						
						count++;
					}
				});
				collection.sort();
				
				// Total words once filtered
				this.set('uniquewordcount', unique);
				this.set('wordcount', count);
				this.set('onelettercount', oneletter);
				this.set('twoletterscount', twoletters);
				this.set('threeletterscount', threeletters);
				
			} else {
				this.set('uniquewordcount', 0);
				this.set('wordcount', 0);
				this.set('onelettercount', 0);
				this.set('twoletterscount', 0);
				this.set('threeletterscount', 0);
				this.set('paragraphcount', 0);
			}			
		},
		
		getUniqueWordCount: function(){
			return this.get('uniquewordcount')
		},
		
		getWordCount: function(){
			return this.get('wordcount')
		},
		
		getMoreOneLetterWordCount: function(){
			return this.get('onelettercount')
		},
		
		getMoreTwoLettersWordCount: function(){
			return this.get('twoletterscount')
		},
		
		getMoreThreeLettersWordCount: function(){
			return this.get('threeletterscount')
		},
	
		getParagraphCount: function(){
			return this.get('paragraphcount')
		}
	})
});