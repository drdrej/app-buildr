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
var PEG = require("pegjs");

var MacroParser = require( "./MAcroManager.js" );
var PreProcessor = require( "./PreProcessorImpl.js" );

function MacrosApi() {
	this.macros = new MacroParser();
};



/**
 * Append suffix and replace an older file. Template-Files use file-names with
 * *.tmpl suffix.
 * 
 * @returns {String}
 */
MacrosApi.prototype.calcOutputPath = function(file) {
	return file + ".tmpl";
};

/**
 * 
 * @param file is a path to source-file
 */
MacrosApi.prototype.preProcess = function(file) {
	var tmplPath = this.calcOutputPath(file);
	
	var that = this;
	
	fs.readFile(file, "utf-8", function(err, data) {
		if (err)
			throw err;

		LOGGER.log("--read file: " + file);
		that.preProcessContent(data, tmplPath);
	});
};

/**
 * pre-process the content
 * 
 * @param data content-string
 * @param tmplPath output-path for the generated file
 * 
 * @returns
 */
MacrosApi.prototype.preProcessContent = function(data, tmplPath) {
    LOGGER.log( "preprocess file: " + tmplPath );
    
	var proc = new PreProcessor( data, tmplPath, this.macros );
	return proc.preProcess();
};

module.exports = MacrosApi;