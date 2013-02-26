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

function Uncomment( params ) {
	this.name = "uncomment";

	this.params = params;

	this.scope = {
		after : "*/",
		end : "#end",
	};
	
	this.parser = {
		newLine: ["\n\r", "\n", "\r" ],

		openComment: [ "//", "/*" ],
	    closeComment: [ undefined, "*/" ]
	};
    
};


Uncomment.prototype.validate = function() {
	console.log( "validate command" );
	
	return {
		success: true
	};
};

/**
 * 
 * @param scope
 * 
 * @returns {Number} -1 if no nextline
 */
Uncomment.prototype.findNextLine = function( scope ) {
	var lines = scope.split(/(\n|\r|\r\n)/);
	
	// hier muss richtig gecutted werden
	LOGGER.log( "found lines after uncomment: " + lines.length );
	
	for( var i = 0; i < lines.length; i++ ) {
		var line = lines[i];
		console.log( "*** charcode: " + line.charCodeAt(0) + " length: " + line.length);
		
		if( line.length < 2)
			continue;
		

		lines[i] = line.replace( "//", "" );
		LOGGER.log("uncomment line [" + i + "]: " + lines[i] );
		break;
	}
	
	return lines.join( "" );
};

Uncomment.prototype.exec = function( scope ) {
	console.log( "-- uncomment.exec()  on scope: " + scope );
	
	return this.findNextLine(scope);
};


/**
 * exports
 */
module.exports = Uncomment;