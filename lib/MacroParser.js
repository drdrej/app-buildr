var fs = require('fs');
console.log("[LOADLIB] module fs is imported: " + (fs != undefined));

var PEG = require("pegjs");
console.log("[LOADLIB] module pegjs is imported: " + (PEG != undefined));

var KEYWORD_START_CMD_SCOPE = "[#";
var KEYWORD_END_CMD_SCOPE = "#]";

function MacroPreProcessor() {
	this.parserDescFile = __dirname + "/MacroParser.pegjs";
	this.parser = PEG.buildParser(this.readParserDesc());
};

MacroPreProcessor.prototype.readParserDesc = function() {
	console.log("-- read preprocessor-parser-config-file: "
			+ this.parserDescFile);
	return fs.readFileSync(this.parserDescFile, "utf8");
};

MacroPreProcessor.prototype.parseCommand = function(txt) {
	console.log("-- start parser");

	return this.parser.parse(txt);
};

/**
 * Append suffix and replace an older file. Template-Files use file-names with
 * *.tmpl suffix.
 * 
 * @returns {String}
 */
MacroPreProcessor.prototype.calcOutputPath = function(file) {
	return file + ".tmpl";
};

MacroPreProcessor.prototype.preProcess = function(file) {
	var tmplPath = this.calcOutputPath(file);

	fs.readFile(file, "utf-8", function(err, data) {
		if (err)
			throw err;

		console.log("--read file: " + file);

		this.preProcessContent(data, tmplPath);
	});
};

function ReplaceCommand() {

};

ReplaceCommand.prototype.validate = function() {
	console.log("-- cmd.validate is called!");

	return true;
};

/**
 * parse the command-block and use the parsed object to create a command object
 * 
 * @param startInstrPos
 * @param endInstrPos
 * @returns {___cmd0}
 */
MacroPreProcessor.prototype.extractCmd = function(data, startInstrPos,
		endInstrPos) {
	var blockEnd = (endInstrPos + 2);
	var txt = data.substring(startInstrPos, blockEnd);

	console.log("-- extract command-block: " + txt);

	try {
		var cmd = this.parseCommand(txt);
		console.log("-- found command: %j", cmd);

		cmd.prototype = ReplaceCommand;

		return cmd;
	} catch (e) {
		throw e;
	}
	;
};

MacroPreProcessor.prototype.preProcessContent = function(data, tmplPath) {
	var lastOffset = 0;

	var out = fs.createWriteStream(tmplPath, {
		'flags' : 'a',
		'encoding' : 'utf-8',
		'mode' : 0666
	});

	/**
	 * pipe chars without modification
	 * 
	 * @param start
	 * @param end
	 */
	function pipe(start, end) {
		if (end == undefined || end == null || end === false) {
			end = data.length - 1;
		}

		var txt = data.substring(start, end);
		out.write(txt);
	};

	// loop over command-blocks :::
	for ( var startInstrPos = data.indexOf(KEYWORD_START_CMD_SCOPE, lastOffset); (startInstrPos > -1); startInstrPos = data
			.indexOf(KEYWORD_START_CMD_SCOPE, lastOffset)) {
		console.log("-- found command-block. start-pos: " + startInstrPos);

		if (startInstrPos > lastOffset) {
			pipe(lastOffset, startInstrPos);
			console
					.log("-- write content before this block to output-write-stream");
		}

		var endInstrPos = data.indexOf(KEYWORD_END_CMD_SCOPE, startInstrPos);
		console.log("-- found end-position of command-block " + endInstrPos);

		if (endInstrPos < 0) {
			console.log("-- couldn't parse command, no close-tag found.");
			pipe(startInstrPos);
			console.log("-- dump txt to file");

			return {
				pos : {
					start : startInstrPos,
					end : endInstrPos,

				},
				msg : "end-position is wrong"
			};
		}

		var cmd = this.extractCmd(data, startInstrPos, endInstrPos);

		if (cmd) {
			if (cmd.validate) {
				var validated = cmd.validate();
				console.log("-- command not found. skip command: %j ",
						validated);

				if (validated.success) {

				} else {
					pipe(startInstrPos, endInstrPos);
				}
			}
		} else {
			console.log("-- command not found. skip command: %j ", cmd);
			pipe(startInstrPos, endInstrPos);
		}

		lastOffset = (endInstrPos + 2);
		console.log("-- update last offset: " + lastOffset);
	}
	;

	// rest schreiben :::
	pipe(lastOffset);

	try {
		out.close();
	} catch ( error ) {
		console.log("-- skip closing file-write-stream: %j", error);
	};

	return true;
};

module.exports = MacroPreProcessor;