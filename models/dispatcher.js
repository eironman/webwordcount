// EXPORTS

/**
 * Index action
 * @param req
 * @param res
 */
function index(req, res, err){
	res.render('index', {title: 'Count words in a web | wordwebcount.com'});
}

/**
 * Counts the words in a web
 * @param req
 * @param res
 */
function count(req, res, err){
	
	var http = require('http');
	var wordlist = [], data = '';

	var url = req.params[0];
	var options = {
	  host: url
	};

	// Do the request
	http.request(options, function(response) {
		
		// Save data received
		response.on('data', function (chunk) {
			data += chunk;
		});

		response.on('end', function () {
			console.log('[OK] Request to: ' + url);
			wordlist = docount(data.toString(), wordlist);
			res.json(wordlist);
		});
		
	}).on('error', function(e){
		console.log('[ERROR] Request to: ' + url + ' Error: '+ e.message);
		res.send('Error');
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
	
	// Remove js code
	data = data.replace(/<script([\s\S]+?)\/script>/g, ' ');
	
	// Extract header words: title, description, keywords
	extractHeaderData(data, wordlist);
	
	// Remove header
	data = data.replace(/<head>[\s\S]+<\/head>/g, ' ');
	
	// Extract headings words
	extractHeadingData(data, wordlist);
	
	// Count words in text
	wordlist = updatecount(data, wordlist);
	
	// Sort array
	wordlist = _(wordlist).sortBy(function(word){
		return word.c;
	}).reverse();
	
	return wordlist;
}

/**
 * Extracts words from heading tags
 * @param data
 * @param wordlist
 */
function extractHeadingData(data, wordlist){
	
	// h1. Good practices ask for only one h1, but there can be more
	var regexp = /<h1>([\s\S]+?)<\/h1>/g;
	while ((arr = regexp.exec(data)) !== null){
		wordlist = updatecount(arr[1], wordlist, 'h1');
	}
	data = data.replace(/<h1>[\s\S]+?<\/h1>/g, ' ');
	
	// h2
	var regexp = /<h2>([\s\S]+?)<\/h2>/g;
	while ((arr = regexp.exec(data)) !== null){
		wordlist = updatecount(arr[1], wordlist, 'h2');
	}
	data = data.replace(/<h2>[\s\S]+?<\/h2>/g, ' ');
	
}

/**
 * Extracts words from header tags title, description and keywords
 * @param data
 * @param wordlist
 */
function extractHeaderData(data, wordlist){
	
	var header = (/<head>([\s\S]+)<\/head>/).exec(data)
	var arr;
	
	if (header !== null){
		
		// Page title
		arr = (/<title>(.+?)<\/title>/g).exec(header);
		if (arr !== null) {
			wordlist = updatecount(arr[1], wordlist, 'ptitle');
		}
		
		// Description. There can be several description tags for different languages
		var descriptionRegexp = /name="keywords".+?content="([^"]+)"/g;
		while ((arr = descriptionRegexp.exec(header)) !== null){
			wordlist = updatecount(arr[1], wordlist, 'desc');
		}
		
		// Keywords. There can be several keyword tags for different languages
		var keywordsRegexp = /name="description".+?content="([^"]+)"/g;
		while ((arr = keywordsRegexp.exec(header)) !== null){
			wordlist = updatecount(arr[1], wordlist, 'keyw');
		}
	}
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

	// Remove tags
	data = data.replace(/<[\s\S]+?>/g, ' ');
	
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
				titles	: type == 'titles' ? 1 : 0,	// Tags title attribute
				alt		: type == 'alt' ? 1 : 0,	// Img alt attribute
				desc	: type == 'desc' ? 1 : 0,
				keyw	: type == 'keyw' ? 1 : 0,
				h1		: type == 'h1' ? 1 : 0,
				h2		: type == 'h2' ? 1 : 0,
				h3		: type == 'h3' ? 1 : 0,
				h4		: type == 'h4' ? 1 : 0,
				h5		: type == 'h5' ? 1 : 0,
				h6		: type == 'h6' ? 1 : 0,
				h7		: type == 'h7' ? 1 : 0
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
			} else if (type == 'h2') {
				wordobj.h2++;
			} else if (type == 'h3') {
				wordobj.h3++;
			} else if (type == 'h4') {
				wordobj.h4++;
			} else if (type == 'h5') {
				wordobj.h5++;
			} else if (type == 'h6') {
				wordobj.h6++;
			} else if (type == 'h7') {
				wordobj.h7++;
			}
		}
	});
	
	return wordlist;
}


