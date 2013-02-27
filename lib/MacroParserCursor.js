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

LOGGER = require( "./Log.js" );

var KEYWORD_MACRO_START = "[#";
var KEYWORD_MACRO_END = "#]";

/**
 * default end-markerfor scopes.
 */
var KEYWORD_SCOPE_END = "#end";

function MacroParserCursor(data) {
	this.data = data;

	this.macro = {
		name : "unknown"	
	};
	
	/* -- current position -- */
	this.offset = 0;

	this.instruction = {
		start : -1,
		end : -1
	};

	this.scope = {	
		start : -1,
		end   : -1
	};

};

/**
 * find the next instruction in code
 * 
 * @returns {Boolean}
 */
MacroParserCursor.prototype.next = function() {
	this.instruction.start = this.data.indexOf(KEYWORD_MACRO_START,
			this.offset);
	this.offset = this.instruction.start;
	
	return (this.instruction.start > -1);
};

MacroParserCursor.prototype.findInstructionEnd = function() {
	this.instruction.end = this.data.indexOf(KEYWORD_MACRO_END,
			this.instruction.start);
	this.offset = this.instruction.end;
	
	return (this.instruction.end > -1);
};

/**
 * extract instruction
 * 
 * @returns
 */
MacroParserCursor.prototype.extractInstruction = function() {
	var start = this.instruction.start;
	var end = this.instruction.end + 2;

	if (end == undefined || end == null || end === false) {
		end = this.data.length - 1;
	}

	this.offset = end;
	
	return this.data.substring(start, end);
};

/**
 * extract content before instruction
 */
MacroParserCursor.prototype.extractBefore = function() {
	return this.data.substring(this.offset, this.instruction.start);
};

/**
 * skips some chars until passed string will be found.
 */ 
MacroParserCursor.prototype.skipUntil = function( pattern, pos ) {
	var found = this.data.indexOf( pattern, pos );
	if( found < 0 ) {
		return pos;
	}
		
	return found;
};

MacroParserCursor.prototype.findScopeStart = function( ) {
	if( this.instruction.end < 0 ) {
		throw new Error( "instruction.end not initialiezed!" );
	}
	
	var afterCmdPos = this.instruction.end + 2;
	
	// -- skip comments until closed multiple line comment 
	this.scope.start = this.skipUntil( "*/", afterCmdPos );
	
	return this.scope.start;
};

MacroParserCursor.prototype.findScopeEnd = function( ) {
	var scopeEnd = this.skipUntil( KEYWORD_SCOPE_END, this.scope.start );
	
	var notFoundScopeEndMarker = (scopeEnd == this.scope.start);
	if( notFoundScopeEndMarker ) {
		scopeEnd = this.data.length-1;
	}
	
	var nextCmd = this.skipUntil( KEYWORD_MACRO_START, this.scope.start );
	
	console.log( " scope: end: " + scopeEnd + ", next-cmd: " + nextCmd );
	
	var rval = this.scope.start;
	
	if( scopeEnd < 0 ) {
		if( nextCmd  < 0)  {
			// -- scope until end of data:
			rval = (this.data.length - 1);
		} else {
			rval = nextCmd;
		}
	} else {
		if( scopeEnd < nextCmd ) {
			rval = scopeEnd;
		} else {
			rval = nextCmd;
		}
	}
		
	this.scope.end = rval;
	
	return this.scope.end;
};

/**
 * extract scope
 * 
 * @param endInstrPos
 *            position in content
 */
MacroParserCursor.prototype.extractScope = function(skipUntil, scopeEndToken) {
	var scopeStart = this.findScopeStart();
	var scopeEnd = this.findScopeEnd();
	
	LOGGER.log("--extract scope: from = " + scopeStart + "; to = " + scopeEnd);
	
	if( scopeStart == scopeEnd) {
		return "";
	}
	
	var scope = this.data.substring(scopeStart, scopeEnd);
	LOGGER.log("scope extracted: '" + scope + "'");

	return scope;
};

/**
 * extract rest of file
 */
MacroParserCursor.prototype.extractRest = function() {
	return this.data.substring(this.offset);
};

/**
 * update
 */
MacroParserCursor.prototype.update = function( macro ) {
	this.macro = macro;
	
	if( macro.offsetFix ) {
		this.offset = (this.scope.start + macro.offsetFix);
		
		return;
	}
	
	if( this.scope.end > this.instruction.end )
		this.offset = this.scope.end;
	else 
		this.offset = this.instruction.end;
};

module.exports = MacroParserCursor;