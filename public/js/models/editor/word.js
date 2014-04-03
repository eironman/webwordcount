$(function(){

	/**
	 * Word model
	 */
	WordModel = Backbone.Model.extend({
		
		defaults: {
			text 		: '',
			count		: 1,
			synonims	: []
		},
		
		addOneCount: function(){
			var count = this.get('count');
			this.set('count', ++count);
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