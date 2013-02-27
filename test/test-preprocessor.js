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
			
			// -------------------------
			// Test: next command
			// -------------------------
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
			
			assert.equal( 116, mp.cursor.scope.start);
			assert.equal( 133, mp.cursor.scope.end );
			
			var txt1 = txt.substring( mp.cursor.scope.start, mp.cursor.offset);
			
			assert.equal( "*/ParentClass", txt1);
		});
	});
	
	describe('#preProcessStep()', function() {
		it('content with word-macro', function() {
			var macros = new MacroParser();
			
			var path = __dirname + "/out-preprocess-replace.test";
			var txt = 'public class /*[#word with:"keyword" #]*/ MyPrototypeClass extends ';

			var mp = new PreProcessor( txt, path, macros );
			
			assert.equal( true, mp.hasMoreCommands() );
			assert.equal( undefined, mp.preProcessStep());
			
			assert.equal( 58, mp.cursor.offset);
			
			assert.equal( 15, mp.cursor.instruction.start );
			assert.equal( 37, mp.cursor.instruction.end );		
			
			assert.equal( 39, mp.cursor.scope.start);
			
			assert.equal( 66, mp.cursor.scope.end);

			var txt1 = txt.substring( mp.cursor.scope.start, mp.cursor.scope.end );
			assert.equal( "*/ MyPrototypeClass extends", txt1);
			
			
			// -------------------------
			// Test: next command
			// -------------------------
			assert.equal( false, mp.hasMoreCommands() );
		});
	});
	
	describe('#preProcessStep()', function() {
		it('content with broken replace-macro', function() {
			var macros = new MacroParser();
			
			var path = __dirname + "/out-preprocess-broken.test";
			var txt = 'public class /*[#replace broken macro';
			
			var mp = new PreProcessor( txt, path, macros );
			
			assert.equal( true, mp.hasMoreCommands() );
			
			var result1 = mp.preProcessStep();
			assert.equal( true, (result1 != undefined) );
			assert.equal( "MACRO_CLOSE_TAG", result1.err );
			
			assert.equal( -1, mp.cursor.instruction.start);
			assert.equal( -1, mp.cursor.instruction.end);

			// offset-cursor is before command:
			assert.equal( (txt.length-1), mp.cursor.offset);
			
			// scope-positions not valid (-1)
			assert.equal( -1, mp.cursor.scope.start);
			assert.equal( -1, mp.cursor.scope.end);
						
			assert.equal( false, mp.hasMoreCommands() );
		});
	});
});