/*

Copyright (c) 2012-2013 Andreas Siebert, ask@touchableheroes.com

Permission is hereby granted, free of charge, to any person obtaining 
a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the 
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included 
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
IN THE SOFTWARE.

*/

/**
 * Find and replace one time. 
 */
function Word(params) {
	this.name = "word";
	this.params = params;

	this.scope = {
		after : "*/",
		end : "#end",
		
		/* some delimiter signs: sind vom dokument abhängig. */
		whitespace : " ,-*/;()" 
	};
};

/**
 * Validate params of this function.
 * 
 * @returns {___anonymous1474_1496}
 */
Word.prototype.validate = function() {
	LOGGER.log("validate command");

	return {
		success : true
	};
};

/**
 * 
 */ 
Word.prototype.skipWhiteSpaces = function( scope, start ) {
	var rval = 0;
	for( var i = start; i < scope.length; i++ ) {
		 var char = scope.charAt( i );
		 
		 var isWhitespace = this.scope.whitespace.indexOf( char );
		 LOGGER.log( "isWhitespace: " + char + " pos: " + isWhitespace );
		 if( isWhitespace >= 0 ) {
			 continue;
		 } else {
			 rval = i;
			 break;
		 }
	};

	LOGGER.log( "find start of word: " + rval );
	return  rval;
};

/**
 * 
 */ 
Word.prototype.findWordEnd = function( scope, start ) {
	var rval = 0;
	
	for( var i = start; i < scope.length; i++ ) {
		 var char = scope.charAt( i );
		 
		 var isWhitespace = this.scope.whitespace.indexOf( char );
		 var foundWhitespace = (isWhitespace < 0);
		 if( foundWhitespace ) {
			 continue;
		 } else {
			 rval = i;
			 break;
		 }
	};
	
	LOGGER.log( "find end of word: " + rval );
	return  rval;
};



/**
 * skip until passed string inluding this length.
 * 
 * @param scope   string
 * @param pattern string (not a regexp!)
 * 
 * @returns {Number} 0 if nothing found, else position after passed string
 */
Word.prototype.skipUntil = function( scope, pattern ) {
	var idx = scope.indexOf( pattern );
	var rval = 0;
	
	if( idx > -1) 
		rval = idx + pattern.length;
	
	LOGGER.log( "skip chars in scope until: " + pattern + "[" + rval +"]");
	
	return rval;
};

/**
 * replace token one time with passed word/phrase
 * 
 * @param scope
 * @returns
 */
Word.prototype.exec = function(scope) {
	var commentEndPos = this.skipUntil( scope, "*/" );
	var start = this.skipWhiteSpaces( scope, commentEndPos );
	var end   = this.findWordEnd( scope, start+1 );
	
	LOGGER.log( "found word with position start = " + start 
			+ "(" + scope.charAt(start) + "), end = " + end 
			+ "(" + scope.charAt(end)
			+ "), skiped = " + commentEndPos );
	
	if( start >= end ) {
		LOGGER.log( "couldn't find word. use the full scope." );
		return scope;
	}
	
	var before = scope.substring( 0, start );
	var after  = scope.substring( end, scope.length );
	var fill = this.params[ "with" ];
	
	var msg = before + fill + after;

	LOGGER.log( "word.exec() : " );
	LOGGER.log( "before = " + msg);
	LOGGER.log( "with = " + fill);
	LOGGER.log( "after = " + after );
	LOGGER.log( "replaced word:" + scope.substring( start, end ) );
	
	return msg;
};


module.exports = Word;