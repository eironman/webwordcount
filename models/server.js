var http = require("http");

function init(app) {

	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});
}

exports.init= init;