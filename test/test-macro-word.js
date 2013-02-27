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

var Replace = require("../lib/macro/word.js");

describe('Word', function() {

	var cmd = {};
	
	beforeEach(function(){
		cmd = new Replace( {
			"with"  : "unit"
		});
	});
	
	describe('#exec()', function() {
		it('should find first word after comment and replace it', function() {
			assert.equal( true, (cmd != undefined) );
			
			var compiled = cmd.exec( "this */ test-case." );
			assert.equal( "this */ unit", compiled);
		});
		
		it('should find first word and replace it', function() {			
			assert.equal( true, (cmd != undefined) );
			
			var compiled = cmd.exec( "this is a test-case." );
			assert.equal( "unit", compiled);
		});
	});

});
