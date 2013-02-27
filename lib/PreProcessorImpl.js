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

var MacroManager = require( "./MacroParser.js" );

function PreProcessor( data, tmplPath, macros ) {
	this.tmplPath = tmplPath;
	this.data = data;
	this.macros = macros;

	
	var MacroGeneratorStream = require( "./MacroGeneratorStream.js" );
	this.tmplStream = new MacroGeneratorStream( data, tmplPath );

	var MacroParserCursor = require( "./MacroParserCursor.js" );
	this.cursor = new MacroParserCursor( data );	
};

PreProcessor.prototype.preProcessStep = function() {
	LOGGER.log("found command-block.");

	this.tmplStream.push( this.cursor.extractBefore());
	
	if(! this.cursor.findInstructionEnd()) {
		LOGGER.log("couldn't parse command, no close-tag found.");
			
		this.tmplStream.push(this.cursor.extractRest());
		this.cursor.offset = (this.data.length-1);

		// reset values:
		this.cursor.instruction.start = -1;
		this.cursor.instruction.end   = -1;
		this.cursor.scope.start 	  = -1;
		this.cursor.scope.end 		  = -1;
		
		return {
			err : "MACRO_CLOSE_TAG",
			msg : "end-position is wrong"
		};	
	};

	var instr = this.cursor.extractInstruction();
	this.tmplStream.push( instr );

	var cmd = this.macros.extractCmd(this.data, 
			this.cursor.instruction.start, 
			this.cursor.instruction.end);
	
	var cmdNotFound = (cmd == undefined || cmd == false || cmd == null);
	
	if ( cmdNotFound ) {
		LOGGER.log("command not found. skip command: %j ", instr);
		return;
	}
	
	var validated = cmd.validate();
	if (!validated.success) {
		LOGGER.log("command not valid. skip command: %j ",
				validated);
		return;
	}

	var scope = this.cursor.extractScope();
	var compiled = cmd.exec(scope);
	LOGGER.log("compiled: " + compiled);
	
	this.tmplStream.push(compiled);
	
	this.cursor.update( cmd );
};



PreProcessor.prototype.hasMoreCommands = function() {
	return this.cursor.next();
};

PreProcessor.prototype.write = function() {
	this.tmplStream.end();
	LOGGER.log("template is written to disk.");
};

PreProcessor.prototype.preProcess = function() {
	while( this.hasMoreCommands() ) {
		var err = this.preProcessStep();
		
		if( err )
			return err;
	}
	;

	this.tmplStream.push(this.cursor.extractRest());
	LOGGER.log("template is ready to use!");
	
	this.write();
	
	return true;
};

module.exports = PreProcessor;