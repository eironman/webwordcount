$(function(){

	/**
	 * Word model
	 */
	WordModel = Backbone.Model.extend({
		
		defaults: {
			text 		: '',
			count		: 1,
			synonyms	: [],
			fetched		: false
		},
		
		addOneCount: function(){
			var count = this.get('count');
			this.set('count', ++count);
		},
		
		getSynonyms: function(){
			
			var self = this;
			
			// Do the request
			$.ajax({
				url: '/synonyms/' + this.get('text')
			}).done(function(data){
				
				self.set({'synonyms' : data, 'fetched' : true});
				
			}).error(function(e){
				alert('Request error ' + e.responseJSON.error +
					  ', code ' + e.responseJSON.statusCode);
			});
		}
	});
	
	WordCollection = Backbone.Collection.extend({
		
		/**
		 * Sorts collection in descending order
		 */
		comparator: function(model){
			return -model.get('count');
		}
	});
});