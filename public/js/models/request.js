$(function(){
	
	/**
	 * Request Model
	 */
	Request = Backbone.Model.extend({
		
		defaults: {
			words		: [],
			paths		: [],
			requestedUrl: '',
			fetched		: false, 	// Indicates if the data has been fetched
			selected	: false		// Indicates if its selected in the list
		},

		doRequest: function(){
			
			// Check if its url has already been fetched
			if ( this.get('fetched') ){
				return;
			}
			
			var self = this;
			
			// Do the request
			$.ajax({
				url: '/count/' + self.get('requestedUrl')
			}).done(function(data){
				
				self.set({
					words	: data.words,
					paths	: data.paths,
					fetched	: true
				});
				
			}).error(function(e){
				$(".loading").addClass('hidden');
				alert('Request error ' + e.responseJSON.error +
					  ', code ' + e.responseJSON.statusCode);
			});
		}
	});
	
	/**
	 * Requests collection
	 */
	RequestCollection = Backbone.Collection.extend({
		model: Request
	});
});














