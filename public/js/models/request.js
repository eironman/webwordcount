$(function(){
	
	/**
	 * Request Model
	 */
	Request = Backbone.Model.extend({
		
		defaults: {
			words		: [],
			paths		: [],
			fetched		: false,
			requestedUrl: '',
			urlRegexp	: /^(?:https?:\/\/)?(?:[\w]+\.)([a-zA-Z\.]{2,6})([\/\w\.-]*)*\/?$/
		},

		doRequest: function(requestUrl){
			
			// Validate url
			if ( requestUrl == '' || !this.get('urlRegexp').test(requestUrl) ){
				return;
			}
			
			// Check if the request has already been done
			if (this.get('requestedUrl') == requestUrl) {
				this.set('fetched', true);
				return;
			}
			
			// Set the requestd url in the model
			this.set('requestedUrl', requestUrl);
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
				alert('Request error, code ' + e.responseJSON.statusCode);
			});
		}
	});
});














