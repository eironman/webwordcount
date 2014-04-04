$(function(){

	/**
	 * Request form View
	 */
	FormView = Backbone.View.extend({
		
		// Form element
		el: '#form-count',
		
		collection	: new RequestCollection(), // Collection of models request
		
		options: {
			result		: new ResultView(),
			reset		: new ResetView(),
			urls		: new UrlsRequestedView(),
		},
		
		initialize: function(){
			
			// Sets the collection for the urls requested list
			var urlList = this.options.urls;
			urlList.collection = this.collection;
			
			// Render list when a request model is added to the collection
			urlList.listenTo(this.collection, "add", urlList.render);
			
			var self = this;
			
			// Length filter
			$('ul.dropdown-menu > li').on('click', function(){
				$('ul.dropdown-menu > li.disabled').removeClass('disabled');
				$(this).addClass('disabled');
				$('li.dropdown > a > span').html($(this).children('a').html());
				self.applyLengthFilter();
			});
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
			
			// Check if the request has already been done
			var request = _(this.collection.models).find(function(req){
				return req.get('requestedUrl') == requestedUrl;
			});
			
			// If the request is already selected don't do anything
			if (typeof request !== "undefined" && request.get('selected')) return;
			
			// Resets previous results
			this.options.reset.render();
			this.deselectModels();
			
			// If the request has already been done use the data in the model
			if ( typeof request !== "undefined" ){
				
				// Render the result of the request
				this.options.result.model = request.set('selected', true);
				this.options.result.render();
				this.options.urls.render();
				return;
			}
			
			// Create the model and add it to the collection
			var request = new Request({'requestedUrl': requestedUrl, 'selected': true});
			this.collection.add(request);
			
			// Sets the model to the result view
			var result = this.options.result;
			result.model = request;
			
			// When request is finished, render the result
			result.listenToOnce(result.model, "change:fetched", result.render);
			
			// Do the request
			request.doRequest();
		},
		
		// Sets selected to false for the models in the collection
		deselectModels: function(){
			_(this.collection.models).each(function(req){
				req.set('selected', false);
			});
		},
		
		// Applies length filter to the selected request
		applyLengthFilter: function(){
			
			var selected = _(this.options.urls.list).find(function(request){
				return request.selected;
			});
			if (selected != 'undefined') {
				this.submit(selected.url);
			}
		},
		
		exportResult: function(){
			this.options.result.exportToCSV();
		}
	});
});
















