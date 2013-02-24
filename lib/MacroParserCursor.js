var KEYWORD_START_CMD_SCOPE = "[#";
var KEYWORD_END_CMD_SCOPE = "#]";


function MacroParserCursor( data ) {
	this.data = data;
	
	this.cursor = 0;
	
	/* -- current position --*/
	this.instruction = {
		start : -1,
		end   : -1
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
	this.instruction.start = this.data.indexOf(KEYWORD_START_CMD_SCOPE, this.cursor); 
	
	return (this.instruction.start > -1);
};


module.exports = MacroParserCursor;