function route(app, dispatcher){
	app.get('/', dispatcher.index);
	app.get('/count/:url', dispatcher.count);
	
	// As nothing else responded, 404 is assumed
	app.use(dispatcher.badrequest);
}

exports.route = route;