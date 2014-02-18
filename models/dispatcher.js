// EXPORTS

/**
 * Index action
 * @param req
 * @param res
 */
function index(req, res, err){
	res.render('index', {title: 'Count the words in a web | wordwebcount.com'});
}

/**
 * Counts the words in a web
 * @param req
 * @param res
 */
function count(req, res, err){
	
	var http = require('http');
	var wordlist = [], data = '';

	var options = {
	  host: req.params.url
	};

	// Do the request
	http.request(options, function(response) {
		
		// Save data received
		response.on('data', function (chunk) {
			data += chunk;
		});

		response.on('end', function () {
			wordlist = docount(data.toString(), wordlist);
			res.json(wordlist);
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

var _ = require('underscore');

/**
 * Does the word count
 * @param string data
 * @param Array wordlist
 * @returns {Array}
 */
function docount(data, wordlist){
	
	var arr;
	
	// Header data: title, description, keywords
	
	// Page title
	arr = (/<title>(.+?)<\/title>/g).exec(data);
	if (arr !== null) {
		wordlist = updatecount(arr[1], wordlist, 'ptitle');
	}
	
	// Description
	var descriptionRegexp = /name="keywords".+?content="([^"]+)"/g;
	while ((arr = descriptionRegexp.exec(data)) !== null){
		wordlist = updatecount(arr[1], wordlist, 'desc');
	}
	
	// Keywords
	var keywordsRegexp = /name="description".+?content="([^"]+)"/g;
	while ((arr = keywordsRegexp.exec(data)) !== null){
		wordlist = updatecount(arr[1], wordlist, 'keyw');
	}
	
	// Remove tags
	data = data.replace(/<head>[\s\S]+<\/head>/g, ' ');
	data = data.replace(/<script([\s\S]+?)\/script>/g, ' ');
	data = data.replace(/<([\s\S]+?)>/g, ' ');
	
	// Count words in text
	wordlist = updatecount(data, wordlist);
	
	// Sort array
	wordlist = _(wordlist).sortBy(function(word){
		return word.c;
	}).reverse();
	
	return wordlist;
}

/**
 * Updates the count
 * @param data
 * @param wordlist
 * @param type: text, title, description, ...
 */
function updatecount(data, wordlist, type){
	
	type = type || 'text';
	var wordobj;

	// Remove parenthesis, commas, points, ...
	data = data.replace(/([\;(\),\.:\[\]\{\}=\?¿\"#]+)|(&nbsp)/g, ' ');
	
	// Remove extra whitespaces, tabs and line breaks
	data = data.toLowerCase().replace(/(\s+)/g, ' ').trim();
	
	// Array of words
	data = data.split(' ');
	
	// Count words
	_(data).each(function(word){
		
		// Find word in array
		wordobj = _(wordlist).find(function(ob){
			return ob.w == word;
		});
		
		// Add word or update count
		if ( typeof wordobj=="undefined" ){
			
			wordlist.push({
				w		: word,
				c		: 1,	// Total count
				text	: type == 'text' ? 1 : 0,
				ptitle	: type == 'ptitle' ? 1 : 0,
				titles	: type == 'titles' ? 1 : 0,
				desc	: type == 'desc' ? 1 : 0,
				keyw	: type == 'keyw' ? 1 : 0
			});
			
		} else {
			
			// Update total count
			wordobj.c++;
			
			if (type == 'text') {
				wordobj.text++;
			} else if (type == 'ptitle') {
				wordobj.ptitle++;
			} else if (type == 'titles') {
				wordobj.titles++;
			} else if (type == 'desc') {
				wordobj.desc++;
			} else if (type == 'keyw') {
				wordobj.keyw++;
			}
		}
	});
	
	return wordlist;
}


