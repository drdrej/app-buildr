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

function ReplaceNextWord(params) {
	this.name = "replace";
	this.params = params;

	// if( this.params[ "token"] == undefined ) {
	// this.params[ "token" ] = this.findNextToken();
	// }

	this.scope = {
		after : "*/",
		end : "#end",
		whitespace : [ " ", ",", "-->", "*/", ";", "," ]
	};
};

// TODO broken
ReplaceNextWord.prototype.findNextToken = function(scope) {

	// for( i = 0; i < scope.length; i++ ) {
	//		
	// }

	return "token";
};

ReplaceNextWord.prototype.validate = function() {
	console.log("-- validate command");

	return {
		success : true
	};
};

ReplaceNextWord.prototype.exec = function(scope) {
	// if( this.params[ "token"] == undefined ) {
	// this.params[ "token" ] = this.findNextToken(scope);
	// }

	var token = this.params.token;
	var wiz = this.params[ "with" ];
	console.log( "-- replace token: '" + token +"' with: '" +  wiz + "'." );
	
	return scope.replace( token, wiz );
	
//	var pos = scope.indexOf(token);
//
//	console.log( "-- found token: " + token + " at position: " + pos );
//	if (pos > 0) {
//       return scope;
//	} else {
//	   // replace one: maybe replace() is better
//	   var before = scope.substring( pos );
//	   var after = scope.substring( pos + token.length );
//	   
//	   return before + this.params[ "with" ] + after;
//	}
//
//	console.log("-- skip exec replace on scope: " + scope + ". token = "
//			+ this.params.token + "not found.");
//	
//	return scope;
};

module.exports = ReplaceNextWord;