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

var MacroParserCursor = require("../lib/MacroParserCursor.js");

describe('MacroGeneratorStream', function() {


	beforeEach(function(){
		;
	});
	
	
	describe('LifeCycle', function() {
		var txt = 'public class /*[#word with:{{params.className}} #]*/ MyPrototypeClass extends /*[#word with:{{params.parent}} #]*/ParentClass { \n\r';

		var cursor = new MacroParserCursor( txt );
     
		it('should has next', function() {
			assert.equal( true, cursor.next() );
			
			assert.equal( "unknown", cursor.macro.name );
			assert.equal( 15, cursor.instruction.start );
			assert.equal( -1, cursor.instruction.end );
			assert.equal( 15, cursor.offset );
		});
		
		it('should has end of instruction', function() {
			assert.equal( true, cursor.findInstructionEnd());
			
			assert.equal( 15, cursor.instruction.start );
			assert.equal( 48, cursor.instruction.end );
			assert.equal( true, (cursor.instruction.end > cursor.instruction.start) );
			
			assert.equal( cursor.instruction.end, cursor.offset );
			
			// offset will be moved after
			assert.equal( 48, cursor.offset );
		});
		
		it('should extract instruction', function() {
			assert.equal( "[#word with:{{params.className}} #]", 
					cursor.extractInstruction() );
			
			assert.equal( 15, cursor.instruction.start );
			assert.equal( 48, cursor.instruction.end );
			assert.equal( true, (cursor.instruction.end > cursor.instruction.start) );
			assert.equal( true, (cursor.offset > cursor.instruction.end));
			
			// offset will be moved after extract- behind the macro.
			assert.equal( 50, cursor.offset );
		});
		
		it('should find scope-start', function() {
			assert.equal( 50, cursor.findScopeStart() );
			
			assert.equal( 50, cursor.offset );
			
			assert.equal( 15, cursor.instruction.start );
			assert.equal( 48, cursor.instruction.end );
			assert.equal( true, (cursor.instruction.end > cursor.instruction.start) );
			assert.equal( true, (cursor.offset > cursor.instruction.end));
		});
		
		it('should find scope-end', function() {
			assert.equal( 80, cursor.findScopeEnd() );
			
			assert.equal( 50, cursor.offset );
			
			assert.equal( 15, cursor.instruction.start );
			assert.equal( 48, cursor.instruction.end );
			assert.equal( true, (cursor.instruction.end > cursor.instruction.start) );
			assert.equal( true, (cursor.offset > cursor.instruction.end));
		});
		
		
		it('should find scope-end', function() {
			assert.equal( "*/ MyPrototypeClass extends /*", cursor.extractScope() );
			assert.equal( 50, cursor.offset );
			assert.equal( 15, cursor.instruction.start );
			assert.equal( 48, cursor.instruction.end );
			assert.equal( true, (cursor.instruction.end > cursor.instruction.start) );
			assert.equal( true, (cursor.offset > cursor.instruction.end));
		});
		
	});
	
	
	describe('MacroParserCursor', function() {
		var txt = 'public class /*[#replace broken macro in text';

		var cursor = new MacroParserCursor( txt );
		
		it('should has next', function() {
			assert.equal( true, cursor.next() );
			
//			assert.equal( "unknown", cursor.macro.name );
			
			assert.equal( 15, cursor.instruction.start );
			assert.equal( -1, cursor.instruction.end );
			assert.equal( 15, cursor.offset );
		});
		
		it('should has end of instruction', function() {
			var success = cursor.findInstructionEnd();

			assert.equal( 15, cursor.instruction.start );
			assert.equal( (txt.length - 1), cursor.instruction.end );
			
			assert.equal( false, success);
//			
//			
//			assert.equal( txt.length, cursor.offset );
		});
	});	
		
	describe('#push()', function() {
		var cursor = new MacroParserCursor( "test data [#should #] be written to file" );

		it('unknown command', function() {
			assert.equal( true, cursor.next() );
			
			assert.equal( 10, cursor.instruction.start );
		});
	});

	
});
