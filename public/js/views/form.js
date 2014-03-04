$(function(){

	/**
	 * Request form
	 */
	FormView = Backbone.View.extend({
		
		// Form element
		el: '#form-count',
		
		// It will store the urls requested and the cid of the models with the
		// stored data of the request
		urls: [],

		options: {
			collection	: new RequestCollection(),
			result		: new ResultView(),
			reset		: new ResetView(),
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
			
			this.call(requestedUrl);
		},
		
		// Does the action
		call: function(requestedUrl){
			
			// Resets previous results
			this.options.reset.render();
			
			// Check if the request has already been done
			var url = _(this.urls).find(function(obj){
				return obj.url == requestedUrl;
			});
			
			// If the request has already been done use the data in the model
			if ( typeof url !== "undefined" ) {
				
				// Find the model in the collection
				var request = this.collection.get(url.modelCid);
				this.options.result.model = request;
				this.options.result.render();
				return;
			}
			
			// Create the model and add it to the collection
			var request = new Request({'requestedUrl': requestedUrl});
			this.collection.add(request);
			
			// Adds url to the list of requested and render it
			this.urls.push({url: requestedUrl, modelCid: request.cid});
			this.render();
			
			// Sets the model to the result view
			var result = this.options.result;
			result.model = request;
			
			// When request is finished, render the result
			result.listenTo(result.model, "change:fetched", result.render);
			
			// Does the request
			request.doRequest();
		},
		
		// Renders url in the list
		render: function(){
			var template = _.template($('#url-list').html(), {list: this.urls});
			$("#urls-requested").html(template);
		}
	});
});
















