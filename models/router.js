function route(app, dispatcher){
	app.get('/', dispatcher.index);
	app.get(/^\/count\/((?:https?:\/\/)?(?:[\w]+\.)([a-zA-Z\.]{2,6})([\/\w\.-]*)*\/?$)/, 
			dispatcher.count);
	
	// As nothing else responded, 404 is assumed
	app.use(dispatcher.badrequest);
}

exports.route = route;