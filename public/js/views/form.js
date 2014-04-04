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
			lengthFilter: 2
		},
		
		initialize: function(){
			
			// Sets the collection for the urls requested list
			var urlList = this.options.urls;
			urlList.collection = this.collection;
			
			// Render list when a request model is added to the collection
			//urlList.listenTo(this.collection, "add", urlList.render);
			
			var self = this;
			
			// Length filter
			$('ul.dropdown-menu > li').on('click', function(){
				$('ul.dropdown-menu > li.disabled').removeClass('disabled');
				$(this).addClass('disabled');
				$('li.dropdown > a > span').html($(this).children('a').html());
				self.setLengthFilter();
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
			
			// Resets previous results
			this.options.reset.render();
			this.deselectModels();

			// Check if the request has already been done
			var request = _(this.collection.models).find(function(req){
				return req.get('requestedUrl') == requestedUrl;
			});
			
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
			this.options.urls.listenToOnce(request, "change:fetched", this.options.urls.render);
			
			// Do the request
			request.doRequest();
		},
		
		// Sets selected to false for the models in the collection
		deselectModels: function(){
			_(this.collection.models).each(function(req){
				req.set('selected', false);
			});
		},
		
		// Sets the length filter value
		setLengthFilter: function(){
			
			var filter = $('ul.dropdown-menu > li.disabled').attr('id');
			if (filter == 'no-filter') {
				this.options.lengthFilter = 0;
			} else if (filter == 'filter-one'){
				this.options.lengthFilter = 1;
			} else if (filter == 'filter-two'){
				this.options.lengthFilter = 2;
			} else if (filter == 'filter-three'){
				this.options.lengthFilter = 3;
			}
		},
		
		// Applies length filter to the selected request
		applyLengthFilter: function(){
			
			var selected = _(this.collection.models).find(function(request){
				return request.get('selected');
			});
			if (typeof selected !== 'undefined') {
				this.submit(selected.get('requestedUrl'));
			}
		},
		
		// Returns the length filter value
		getLengthFilter: function(){
			return this.options.lengthFilter
		},
		
		exportResult: function(){
			this.options.result.exportToCSV();
		}
	});
});
















