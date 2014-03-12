$(function(){

	/**
	 * Request form View
	 */
	FormView = Backbone.View.extend({
		
		// Form element
		el: '#form-count',
		
		options: {
			collection	: new RequestCollection(), // Collection of models request
			result		: new ResultView(),
			reset		: new ResetView(),
			urls		: new UrlsRequestedView(),
		},
		
		events: {
			'submit' : 'validate'
		},
		
		// Validates the url
		validate: function(e){
			e.preventDefault();
			
			var urlRegexp = /^(?:https?:\/\/)?(?:[\w]+\.)([a-zA-Z\.]{2,6})([\/\w\.-]*)*\/?$/;
			var requestedUrl = $("#url").val();
			
			// Validate url
			if ( requestedUrl == '' || !urlRegexp.test(requestedUrl) ){
				alert('Invalid url');
				return;
			}
			
			this.submit(requestedUrl);
		},
		
		// Does the action
		submit: function(requestedUrl){
			
			// Resets previous results
			this.options.reset.render();
			
			// Check if the request has already been done
			var url = _(this.options.urls.list).find(function(obj){
				return obj.url == requestedUrl;
			});
			
			// If the request has already been done use the data in the model
			if ( typeof url !== "undefined" ) {
				
				// TODO: Mark url as active
				
				// Find the model in the collection
				var model = this.collection.get(url.modelCid);
				this.options.result.model = model;
				this.options.result.render();
				return;
			}
			
			// Create the model and add it to the collection
			var request = new Request({'requestedUrl': requestedUrl});
			this.collection.add(request);
			
			// Adds url to the list
			this.options.urls.addUrl({
				url		: requestedUrl,
				modelCid: request.cid,
				active	: true
			});
			
			// Sets the model to the result view
			var result = this.options.result;
			result.model = request;
			
			// When request is finished, render the result
			result.listenTo(result.model, "change:fetched", result.render);
			
			// Do the request
			request.doRequest();
		}
	});
});
















