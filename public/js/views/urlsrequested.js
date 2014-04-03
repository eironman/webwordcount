$(function(){

	/**
	 * Urls requested View
	 */
	UrlsRequestedView = Backbone.View.extend({
		
		el: '#urls-requested',
		
		events: {
			'click a' : 'showResult'
		},
		
		// It will store the urls requested and the cid of the models with the
		// stored data of the request {url, modelCid, active}
		list: [],
		
		// Shows the result of a selected url
		showResult: function(e){
			e.preventDefault();
			
			// Url selected
			var url = $(e.currentTarget).html();
			this.setActive(url)

			// Show the result
			form.submit(url);
		},
		
		// Sets a url as active and renders the list
		setActive: function(url){
			
			// Mark url as active, mark rest as non-active 
			_(this.list).map(function(obj){
				if (obj.url == url) {
					obj.active = true;
				} else {
					obj.active = false;
				}
			});
			this.render();
		},
		
		// Adds url to the list
		addUrl: function(obj){

			// Set all urls to non-active
			_(this.list).map(function(obj){
				obj.active = false;
			});
			
			// Add new url
			this.list.push(obj);
			this.render();
		},
		
		// Marks an url in the list as active, and sets the rest to false
		setActiveUrl: function(url){
			
			_(this.list).map(function(obj){
				obj.active = true;
			});
			
			this.render();
		},
		
		// Shows the word count of a request once fetched
		updateUrlCount: function(url, count){
		},
		
		// Renders urls
		render: function(){
			var template = _.template($('#url-list').html(), {list: this.list});
			this.$el.html(template);
		}
	});
});