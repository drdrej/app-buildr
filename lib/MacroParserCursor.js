var KEYWORD_START_CMD_SCOPE = "[#";
var KEYWORD_END_CMD_SCOPE = "#]";

function MacroParserCursor(data) {
	this.data = data;

	/* -- current position -- */
	this.offset = 0;

	this.instruction = {
		start : -1,
		end : -1
	};

	this.scopeEnd = -1;
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
 * extract conetnt before instruction
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
MacroParserCursor.prototype.extractScope = function(scopeEndToken) {
	var startPos = this.instruction.end + 2;
	var endPos = this.data.indexOf(scopeEndToken, startPos);

	var scope = "";
	if (endPos > -1) {
		scope = this.data.substring(startPos, endPos);
		console.log("-- extract scope from " + startPos + "until pos: " + endPos);
		this.scopeEnd = endPos;
	} else {
		scope = this.data.substring(startPos);
		console.log("-- extract scope until end of text");
		this.scopeEnd = this.data.length;
	}
	
	console.log("-- scope extracted: '" + scope + "'");

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
MacroParserCursor.prototype.update = function() {
	if( this.scopeEnd > this.instruction.end )
		this.offset = this.scopeEnd;
	else
		this.offset = this.instruction.end;
};

module.exports = MacroParserCursor;