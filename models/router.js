function route(app, dispatcher){
	
	// Index
	app.get('/', dispatcher.index);
	
	// Text editor
	app.get('/word-counter-online', dispatcher.editor);	
	
	// Synonyms
	app.get(/^\/synonyms\/([a-záéíóúñ]+$)/,  dispatcher.synonyms);
	
	// Count words
	app.get(/^\/count\/((?:https?:\/\/)?(?:[\w]+\.)([a-zA-Z\.]{2,6})([\/\w\.-]*)*\/?$)/, 
			dispatcher.count);
	
	// As nothing else responded, 404 is assumed
	app.use(dispatcher.badrequest);
}

exports.route = route;