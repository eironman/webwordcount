$(function(){
	
	/**
	 * Default view
	 */
	DefaultView = Backbone.View.extend({
		
		// Result list
		el: '#result tbody',

		initialize: function(){
			// If the url model changes, render it
			this.listenTo(this.model, "change:requestedUrl", this.render);
		},
		
		// Default value of the list
		initWords: [{
			w		: '-',
			c		: 0,
			text	: 0,
			ptitle	: 0,
			desc	: 0,
			keyw	: 0,
			heading	: 0
		}],
		
		render: function(){
			$(".loading").removeClass('hidden');
			$("#urls-requested").html('');
			$('.page-header > span').html(0);
			
			// Default list html
			var params = {list: this.initWords, lengthFilter: 0};
			var template = _.template($('#word-list').html(), params);
            this.$el.html(template);
		}
	});
});