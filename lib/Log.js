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

function Log() {
	
};

Log.prototype.log = function( msg ) {
	if( msg == undefined || msg == null || msg == false) {
		console.log( msg );
		return;
	}
	
	if( msg.length > 50 ) {
		var log = "-- " + msg.substring(0,50) + "...";
		console.log( log );
		return;
	}
	
	console.log( msg );
	
	return msg;
};

Log.prototype.error = function( msg ) {
	var msgCutted = this.log( msg );
	
	throw new Error( msgCutted );
};

Log.prototype.warn = function( msg ) {
	return this.log( "[WARN]" + msg );
};

Log.prototype.success = function( msg ) {
	return this.log( "[SUCCESSFUL]" + msg );
};



var LOGGER = new Log();
module.exports = LOGGER;