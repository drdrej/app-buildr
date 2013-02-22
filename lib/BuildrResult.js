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

// This class logs results

function Result() {
    this.warningCounter = 0;	
    this.successfulCounter = 0;
};

Result.prototype.appHeader = function( buildrVersion, modelVersion ) {
	console.log("===========================================");
	console.log("App-Buildr - builds apps from model" );
	console.log("Buildr-Version: ", buildrVersion );
	console.log("Model-Version: ", modelVersion );
	console.log("===========================================");
};

Result.prototype.chapter = function( name ) {
	console.log();
	console.log("Chapter: " + name);
	console.log("------------------------");
};

Result.prototype.log = function( msg ) {
	console.log( "-- " + msg );
};

/**
 *  Error, but skip it
 */
Result.prototype.warn = function( msg ) {
	this.warningCounter++;
	console.log( msg );
};

/**
 *  real problem. stop the app
 */
Result.prototype.problem = function( msg ) {
	console.log( "[ERROR] " + msg );
	throw new Error( msg );
};

Result.prototype.success = function( msg ) {
	this.successfulCounter++;
	console.log( "[SUCCESSFUL] " + msg );
};

Result.prototype.ready = function() {
	console.log( "" );
	console.log( "Chapter: Result" );
	console.log( "=================================================================" );
	
	console.log( "some App-creation-statistics." );
	console.log( "" );
	console.log( "WARNINGS: " + this.warningCounter );
	console.log( "SUCCESSFUL: " + this.successfulCounter );
	console.log( "");
	console.log( "Thank you!" );
};


module.exports = Result;
