// EXPORTS

/**
 * Index action
 * @param req
 * @param res
 */
function index(req, res, err){
	res.render('index', {title: 'Count words in a web | wherearemywords.com'});
}

/**
 * Counts the words in a web
 * @param req
 * @param res
 */
function count(req, res, err){
	
	// List of words. Global variable
	list = {'words':[], 'paths':[], 'url': []};
	var request = require('request');
	
	// Get url, add http if needed
	var url = req.params[0];
	var http = /^https?:\/\//.exec(url);
	if ( http === null ){
		url = 'http://' + url;
	}
	
	// Do the request
	request(url, function(error, response, body) {
		
		if (!error && response.statusCode == 200) {
			
			// Success
			console.log('[OK] Request to: ' + url);
			docount(body.toString());
			list.url.push(url);
			res.json(list);
			
		} else{
			
			// Error
			console.log('[ERROR] Request to: ' + url + ' Error: ' + error + 
						' Status: ' + response.statusCode);
			res.status(404).json({"statusCode" : response.statusCode});
		}
	});
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
 * @param Array list
 * @returns {Array}
 */
function docount(data){
	
	// Remove js code
	data = data.replace(/<script([\s\S]+?)\/script>/gi, ' ');
	
	// Extract header words: title, description, keywords
	data = extractHeaderData(data);

	// Extract headings words
	data = extractHeadingData(data);
	
	extractPaths(data);
	
	// Count words in regular text
	updatecount(data);
	
	// Sort array but word appearances
	list.words = _(list.words).sortBy(function(word){
		return word.c;
	}).reverse();
	
	return list;
}

/**
 * Extracts paths that follow the same domain
 * @param data
 */
function extractPaths(data){
	
	var regexp = /href="([^\.:]+?)"/g;
	var path;
	while ((arr = regexp.exec(data)) !== null){
		
		// Find path in list
		path = _(list.paths).find(function(ob){
			return ob == arr[1];
		});
		
		// Add path
		if ( typeof path=="undefined" ){
			list.paths.push(arr[1]);
		}
	}
}

/**
 * Extracts words from heading tags
 * @param data
 */
function extractHeadingData(data){
	
	// h1. Good practices ask for only one h1, but there can be more
	var regexp = /<h1>([\s\S]+?)<\/h1>/g;
	while ((arr = regexp.exec(data)) !== null){
		updatecount(arr[1], 'h1');
	}
	data = data.replace(/<h1>[\s\S]+?<\/h1>/g, ' ');
	
	// h2
	regexp = /<h2>([\s\S]+?)<\/h2>/g;
	while ((arr = regexp.exec(data)) !== null){
		updatecount(arr[1], 'h2');
	}
	data = data.replace(/<h2>[\s\S]+?<\/h2>/g, ' ');
	
	// h3
	regexp = /<h3>([\s\S]+?)<\/h3>/g;
	while ((arr = regexp.exec(data)) !== null){
		updatecount(arr[1], 'h3');
	}
	data = data.replace(/<h3>[\s\S]+?<\/h3>/g, ' ');
	
	// h4
	regexp = /<h4>([\s\S]+?)<\/h4>/g;
	while ((arr = regexp.exec(data)) !== null){
		updatecount(arr[1], 'h4');
	}
	data = data.replace(/<h4>[\s\S]+?<\/h4>/g, ' ');
	
	// h5
	regexp = /<h5>([\s\S]+?)<\/h5>/g;
	while ((arr = regexp.exec(data)) !== null){
		updatecount(arr[1], 'h5');
	}
	data = data.replace(/<h5>[\s\S]+?<\/h5>/g, ' ');
	
	// h6
	regexp = /<h6>([\s\S]+?)<\/h6>/g;
	while ((arr = regexp.exec(data)) !== null){
		updatecount(arr[1], 'h6');
	}
	data = data.replace(/<h6>[\s\S]+?<\/h6>/g, ' ');
	
	return data;
}

/**
 * Extracts words from header tags title, description and keywords
 * @param data
 */
function extractHeaderData(data){
	
	var header = (/<head>([\s\S]+)<\/head>/).exec(data);
	var arr;
	
	if (header !== null){
		
		header = header[1];
		
		// Page title
		arr = (/<title>(.+?)<\/title>/g).exec(header);
		if (arr !== null) {
			updatecount(arr[1], 'ptitle');
		}
		
		// Keywords. There can be several keyword tags for different languages
		var keywordsRegexp = /name="keywords".+?content="([^"]+)"/gi;
		while ((arr = keywordsRegexp.exec(header)) !== null){
			updatecount(arr[1], 'keyw');
		}
		
		// Description. There can be several description tags for different languages
		var descriptionRegexp = /name="description".+?content="([^"]+)"/gi;
		while ((arr = descriptionRegexp.exec(header)) !== null){
			updatecount(arr[1], 'desc');
		}
		
		data = data.replace(/<head>[\s\S]+<\/head>/g, ' ');
	}
	
	return data;
}

/**
 * Updates the word count
 * @param data
 * @param type: text, title, description, ...
 */
function updatecount(data, type){
	
	type = type || 'text';
	var wordobj;

	// Remove parenthesis, commas, points, ...				-- This only for the "'" character --
	data = data.replace(/([\;(\),\.:\[\]\{\}=\?¿\"#]+)|(&nbsp)|(^|\s|,|\.)'|'($|\s|\.|,)/g, ' ');

	// Remove tags
	data = data.replace(/<[\s\S]+?>/g, ' ');
	
	// Remove extra whitespaces, tabs and line breaks
	data = data.toLowerCase().replace(/(\s+)/g, ' ').trim();
	
	// Array of words
	data = data.split(' ');
	
	// Count words
	_(data).each(function(word){
		
		// Find word in array
		wordobj = _(list.words).find(function(ob){
			return ob.w == word;
		});
		
		// Add word or update count
		if ( typeof wordobj=="undefined" ){
			
			list.words.push({
				w		: word,
				c		: 1,	// Total count
				text	: type == 'text' ? 1 : 0,
				ptitle	: type == 'ptitle' ? 1 : 0,
				titles	: type == 'titles' ? 1 : 0,	// Attribute title
				alt		: type == 'alt' ? 1 : 0,	// Alt attribute
				desc	: type == 'desc' ? 1 : 0,
				keyw	: type == 'keyw' ? 1 : 0,
				heading	: _(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).contains(type) ? 1 : 0,
				h1		: type == 'h1' ? 1 : 0,
				h2		: type == 'h2' ? 1 : 0,
				h3		: type == 'h3' ? 1 : 0,
				h4		: type == 'h4' ? 1 : 0,
				h5		: type == 'h5' ? 1 : 0,
				h6		: type == 'h6' ? 1 : 0
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
			} else if (type == 'alt') {
				wordobj.alt++;
			} else if (type == 'desc') {
				wordobj.desc++;
			} else if (type == 'keyw') {
				wordobj.keyw++;
			} else if (type == 'h1') {
				wordobj.h1++;
				wordobj.heading++;
			} else if (type == 'h2') {
				wordobj.h2++;
				wordobj.heading++;
			} else if (type == 'h3') {
				wordobj.h3++;
				wordobj.heading++;
			} else if (type == 'h4') {
				wordobj.h4++;
				wordobj.heading++;
			} else if (type == 'h5') {
				wordobj.h5++;
				wordobj.heading++;
			} else if (type == 'h6') {
				wordobj.h6++;
				wordobj.heading++;
			}
		}
	});
}


