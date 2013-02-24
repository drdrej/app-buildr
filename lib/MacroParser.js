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
MacroPreProcessor.prototype.extractCmd = function(data, startInstrPos,
		endInstrPos) {
	var blockEnd = (endInstrPos + 2);
	var txt = data.substring(startInstrPos, blockEnd);

	console.log("-- extract command-block: " + txt);

	return this.initCmd(txt);
};

/**
 * 
 * @param txt
 *            command-block
 * @returns
 */
MacroPreProcessor.prototype.initCmd = function(cmdBlock) {
	try {
		var cmdDecl = this.parseCommand(cmdBlock);
		console.log("-- found command: %j", cmdDecl);

		var CmdType = require("./macro/" + cmdDecl.name + ".js");
		var cmdInst = new CmdType(cmdDecl.params);

		return cmdInst;
	} catch (e) {
		console.log("-- couldn't init command: " + cmdBlock);
		throw e;
	}
	;
};


/**
 * pre-process the content
 * 
 * @param data content-string
 * @param tmplPath output-path for the generated file
 * 
 * @returns
 */
MacroPreProcessor.prototype.preProcessContent = function(data, tmplPath) {

	var MacroGeneratorStream = require( "./MacroGeneratorStream.js" );
	var tmplStream = new MacroGeneratorStream( data, tmplPath );

	var MacroParserCursor = require( "./MacroParserCursor.js" );
	var cursor = new MacroParserCursor( data );
	
	
	// loop over command-blocks :::
	while( cursor.next() ) {
		console.log("-- found command-block.");

		tmplStream.push(cursor.extractBefore());
		
		if(!cursor.findInstructionEnd()) {
			console.log("-- couldn't parse command, no close-tag found.");
			tmplStream.push(cursor.extractRest());
			console.log("-- dump txt to file");

			return {
				pos : {
					start : 0,
					end : 0,

				},
				msg : "end-position is wrong"
			};	
		};
		
		
		// hier refactorn
		var cmd = this.extractCmd(data, cursor.instruction.start, cursor.instruction.end);
		var cmdNotFound = (cmd == undefined || cmd == false || cmd == null);
		
		if ( cmdNotFound ) {
			console.log("-- command not found. skip command: %j ", cmd);
			continue;
		}
			
		tmplStream.push(cursor.extractInstruction());
			
		var validated = cmd.validate();
		if (!validated.success) {
			console.log("-- command not valid. skip command: %j ",
					validated);
			continue;
		}
			
		var scope = cursor.extractScope( "#end" );
		var compiled = cmd.exec(scope);
		console.log("-- compiled: " + compiled);

		tmplStream.push(compiled);
		cursor.update();
	}
	;

	tmplStream.push(cursor.extractRest());
	tmplStream.end();

	console.log("-- template is ready to use!");
	return true;
};

module.exports = MacroPreProcessor;