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

var assert = require("assert");

var fs = require( "fs" );
var PreProcessor = require("../lib/PreProcessorImpl.js");
var MacroParser = require("../lib/MacroParser.js");

describe('PreProcessorImpl', function() {

	
	beforeEach(function(){
		;
	});
	
	describe('#preProcessStep()', function() {
		it('content with multiple word-macros', function() {
			var macros = new MacroParser();
			
			var path = __dirname + "/out-preprocess-java.test";
			var txt = 'public class /*[#word with:{{params.className}} #]    */ MyPrototypeClass extends /*[#word with:{{params.parent}} #]*/ParentClass { \n\r';
			
			var mp = new PreProcessor( txt, path, macros );
			
			assert.equal( true, mp.hasMoreCommands() );
			mp.preProcessStep();
			
			// check cursor:
			assert.equal( 73, mp.cursor.offset);
			
			assert.equal( 15, mp.cursor.instruction.start );
			assert.equal( 48, mp.cursor.instruction.end );			
			assert.equal( 54, mp.cursor.scope.start);
			
			var txt1 = txt.substring( mp.cursor.scope.start, mp.cursor.offset);
			assert.equal( "*/ MyPrototypeClass", txt1);
			
			
			// -------------------------
			// Test: next command
			// -------------------------
			
			assert.equal( true, mp.hasMoreCommands() );
			mp.preProcessStep();
			
			// check cursor:
			assert.equal( 129, mp.cursor.offset);
			
			assert.equal( 84, mp.cursor.instruction.start );
			assert.equal( 114, mp.cursor.instruction.end );			
			
			var txt1 = txt.substring( mp.cursor.scope.start, mp.cursor.offset);
			assert.equal( "*/ParentClass", txt1);
		});
	});
	
	describe('#preProcessStep()', function() {
		it('content with multiple replace-macros', function() {
			var macros = new MacroParser();
			
			var path = __dirname + "/out-preprocess-java.test";
			var txt = 'public class /*[#replace token:"extends" with:"keyword" #]*/ MyPrototypeClass extends ';
			
			var mp = new PreProcessor( txt, path, macros );
			
			assert.equal( true, mp.hasMoreCommands() );
			mp.preProcessStep();
			
			// check cursor:
			assert.equal( 161, mp.cursor.offset);
			
			assert.equal( 15, mp.cursor.instruction.start );
			assert.equal( 48, mp.cursor.instruction.end );			
			assert.equal( 54, mp.cursor.scope.start);
			
			var txt1 = txt.substring( mp.cursor.scope.start, mp.cursor.offset);
			assert.equal( "*/ MyPrototypeClass", txt1);
			
			
			// -------------------------
			// Test: next command
			// -------------------------
			
			assert.equal( true, mp.hasMoreCommands() );
			mp.preProcessStep();
			
			// check cursor:
			assert.equal( 129, mp.cursor.offset);
			
			assert.equal( 84, mp.cursor.instruction.start );
			assert.equal( 114, mp.cursor.instruction.end );			
			
			var txt1 = txt.substring( mp.cursor.scope.start, mp.cursor.offset);
			assert.equal( "*/ParentClass", txt1);
		});
	});
	
	describe('#preProcessStep()', function() {
		it('content with broken replace-macro', function() {
			var macros = new MacroParser();
			
			var path = __dirname + "/out-preprocess-broken.test";
			var txt = 'public class /*[#replace broken macro';
			
			var mp = new PreProcessor( txt, path, macros );
			
			assert.equal( true, mp.hasMoreCommands() );
			mp.preProcessStep();
			
			assert.equal( 15, mp.cursor.instruction.start);
			assert.equal( -1, mp.cursor.instruction.end);
			
			// check cursor:
			assert.equal( 161, mp.cursor.offset);
			
			assert.equal( 15, mp.cursor.instruction.start );
			assert.equal( 48, mp.cursor.instruction.end );			
			assert.equal( 54, mp.cursor.scope.start);
			
			var txt1 = txt.substring( mp.cursor.scope.start, mp.cursor.offset);
			assert.equal( "*/ MyPrototypeClass", txt1);
			
			
			// -------------------------
			// Test: next command
			// -------------------------
			
			assert.equal( true, mp.hasMoreCommands() );
			mp.preProcessStep();
			
			// check cursor:
			assert.equal( 129, mp.cursor.offset);
			
			assert.equal( 84, mp.cursor.instruction.start );
			assert.equal( 114, mp.cursor.instruction.end );			
			
			var txt1 = txt.substring( mp.cursor.scope.start, mp.cursor.offset);
			assert.equal( "*/ParentClass", txt1);
		});
	});
});