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
	console.log("-- validate command");

	return {
		success : true
	};
};


Word.prototype.skipWhiteSpaces = function( scope ) {
	for( var i = 0; i < scope.length; i++ ) {
		 var char = scope.charAt( i );
		 
		 var isWhitespace = this.scope.whitespace.indexOf( char );
		 if( isWhitespace < 0 )
			 continue;
		 else
			 return i;
	};
	
	return  0;
};


Word.prototype.findWordEnd = function( scope ) {
	for( var i = 0; i < scope.length; i++ ) {
		 var char = scope.charAt( i );
		 
		 var isWhitespace = this.scope.whitespace.indexOf( char );
		 if( isWhitespace >= 0 )
			 continue;
		 else
			 return i;
	};
	
	return  0;
};


/**
 * replace toke one time by passed word/phrase
 * 
 * @param scope
 * @returns
 */
Word.prototype.exec = function(scope) {
	var start = this.skipWhiteSpaces( scope );
	var end   = this.findWordEnd( scope );
	
	if( start < end ) {
		console.log( "-- couldn't find word. use the full scope." );
		return scope;
	}
	
	var before = scope.substring( 0, start );
	var after  = scope.substring( end );
	
	var msg = before + this.params[ "with" ] + after;
	console.log( "-- word.exec() : " + msg );
	
	return msg;
};



module.exports = Word;