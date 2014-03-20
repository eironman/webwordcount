$(function(){

	/**
	 * Text editor view
	 */
	EditorView = Backbone.View.extend({
		
		el: '#text-editor',
		
		events:{
			'keyup' : 'parse'
		},
		
		model: new EditorModel(),
		
		initialize: function(){
			console.info(this.model.get('paragraphs'));
		},
		
		parse: function(){
			this.model.parse(this.$el.val());
			console.info(this.model.get('paragraphs'));
		}
	});
});