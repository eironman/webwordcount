$(function(){
	
	EditorModel = Backbone.Model.extend({
		
		defaults: {
			words 		: 0,
			paragraphs	: 0
		},
		
		parse: function(text){
			
			// TODO: Trim and replace consecutive intros
			
			// Count paragraphs
			if (text != '') {
				for(var count=0,index=-2; index != -1; count++){
					index=text.indexOf("\n",index+1);
				}
			} else {
				count = 0;
			}
			
			this.set('paragraphs', count);
		}
	})
});
