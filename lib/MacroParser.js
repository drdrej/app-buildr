LOGGER = require( "./Log.js" );

var fs  = require( "fs" );
var PEG = require("pegjs");

function MacroParser() {
	this.parserDescFile = __dirname + "/MacroParser.pegjs";
	this.parser = PEG.buildParser(this.readParserDesc());
};

MacroParser.prototype.readParserDesc = function() {
	LOGGER.log("read preprocessor-parser-config-file: "
			+ this.parserDescFile);
	return fs.readFileSync(this.parserDescFile, "utf8");
};

MacroParser.prototype.parseCommand = function(txt) {
	LOGGER.log("start parser");
	return this.parser.parse(txt);
};


/**
 * parse the command-block and use the parsed object to create a command object
 * 
 * @param data
 *            is the file-content
 * @param startInstrPos
 *            start position of a command
 * @param endInstrPos
 *            end position of the command
 * 
 * @returns replace-command-instance
 */
MacroParser.prototype.extractCmd = function(data, startInstrPos,
		endInstrPos) {
	var blockEnd = (endInstrPos + 2);
	var txt = data.substring(startInstrPos, blockEnd);

	LOGGER.log("extract command-block: " + txt);

	return this.initCmd(txt);
};

/**
 * 
 * @param txt
 *            command-block
 * @returns
 */
MacroParser.prototype.initCmd = function(cmdBlock) {
	try {
		var cmdDecl = this.parseCommand(cmdBlock);
		LOGGER.log("found command: %j", cmdDecl);

		var CmdType = require("./macro/" + cmdDecl.name + ".js");
		var cmdInst = new CmdType(cmdDecl.params);

		return cmdInst;
	} catch (e) {
		LOGGER.log("couldn't init command: " + cmdBlock);
		LOGGER.log(e);
		
		throw e;
	}
	;
};


module.exports = MacroParser;