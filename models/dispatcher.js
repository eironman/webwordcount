// EXPORTS

/**
 * Index action
 * @param req
 * @param res
 */
function index(req, res, err){
	res.render('index', {title: 'Portada word count'});
}

/**
 * Counts the words in a web
 * @param req
 * @param res
 */
function count(req, res, err){
	
	var http = require('http');
	var data, count;

	var options = {
	  host: req.params.url
	};

	// Do the request
	http.request(options, function(response) {
		
		data = '';
		
		// Save data received
		response.on('data', function (chunk) {
			data += chunk;
		});

		response.on('end', function () {
			count = docount(data.toString());
			res.json(count);
		});
		
	}).end();
}

/**
 * Error message for a bad request
 * @param req
 * @param res
 * @param next
 */
function badrequest(req, res, next){
	res.status(404);
	res.render('404');
}

exports.index = index;
exports.count = count;
exports.badrequest = badrequest;

// UTILS

/**
 * Does the word count
 * @param string data
 * @returns {Array}
 */
function docount(data){
	
	var _ = require('underscore');
	var words, wordobj;
	var wordcount = [];
	
	// Remove js code
	data = data.replace(/<script([\s\S]+?)\/script>/g, ' ');
	
	// Remove tags, parenthesis, commas, points, ...
	data = data.replace(/(<([\s\S]+?)>)|([\;(\),\.:\[\]\{\}=\?¿\"#]+)|(&nbsp)/g, ' ');
	
	// Remove whitespaces, tabs and line breaks
	data = data.replace(/(\s+)/g, ' ').trim();
	
	// Array of words
	words = data.split(' ');
	
	// Count words
	_(words).each(function(word){
		
		// Find word in array
		wordobj = _(wordcount).find(function(ob){
			return ob.w == word;
		});
		
		// Add word or update count
		if ( typeof wordobj=="undefined" ){
			wordcount.push({w : word, c : 1});
		} else {
			wordobj.c++
		}
	});
	
	// Sort array
	wordcount = _(wordcount).sortBy(function(word){
		return word.c;
	}).reverse();
	
	return wordcount;
}
