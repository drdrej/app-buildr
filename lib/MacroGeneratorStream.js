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

LOGGER = require("./Log.js" );
var fs = require('fs');

/**
 * Generator-Stream-Wraper
 * -- simple implementation.
 * 
 * @param data
 * @param toFile
 * 
 * @returns
 */
function MacroGeneratorStream( data, toFile ) {
	this.toFile = toFile;
	this.data = data;
	this.buffer = "";
};

/**
 * push content to file
 * 
 * @param start
 * @param end
 */
MacroGeneratorStream.prototype.push = function(txt) {
	this.buffer = this.buffer + txt;
	var logTxt = txt;
	if( txt.length > 50 ) 
		logTxt = txt.substring(0, 50);
	
	LOGGER.log("pushed: '" + logTxt + "'. successful.");
	
	return true;
};


MacroGeneratorStream.prototype.end = function() {
	fs.writeFileSync(this.toFile, this.buffer);
};

module.exports = MacroGeneratorStream;