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

var KEYWORD_START_CMD_SCOPE = "[#";
var KEYWORD_END_CMD_SCOPE = "#]";

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
		end   : -1
	};

};

/**
 * find the next instruction in code
 * 
 * @returns {Boolean}
 */
MacroParserCursor.prototype.next = function() {
	this.instruction.start = this.data.indexOf(KEYWORD_START_CMD_SCOPE,
			this.offset);

	return (this.instruction.start > -1);
};

MacroParserCursor.prototype.findInstructionEnd = function() {
	this.instruction.end = this.data.indexOf(KEYWORD_END_CMD_SCOPE,
			this.instruction.start);

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

	return this.data.substring(start, end);
};

/**
 * extract content before instruction
 */
MacroParserCursor.prototype.extractBefore = function() {
	return this.data.substring(this.offset, this.instruction.start);
};

/**
 * extract scope
 * 
 * @param endInstrPos
 *            position in content
 */
MacroParserCursor.prototype.extractScope = function(skipUntil, scopeEndToken) {
	var afterCmdPos = this.instruction.end + 2;
	
	var startPos = this.data.indexOf( skipUntil, afterCmdPos );
	if( startPos < 0 ) {
		startPos = afterCmdPos;
	}
		
	this.scope.start = startPos;
	
	var endPos = this.data.indexOf(scopeEndToken, startPos);

	var scope = "";
	if (endPos > -1) {
		scope = this.data.substring(startPos, endPos);
		LOGGER.log("extract scope from " + startPos + "until pos: " + endPos);

		this.scope.end = endPos;
	} else {
		scope = this.data.substring(startPos);
		LOGGER.log("extract scope until end of text");
		
		this.scope.end = this.data.length;
	}
	
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