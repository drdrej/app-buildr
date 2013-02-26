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
LOGGER = require( "../lib/Log.js" );

var Uncomment = require("../lib/macro/uncomment.js");

describe('Uncomment', function() {

	var cmd = {};
	
	beforeEach(function(){
		cmd = new Uncomment( {
			"with"  : "unit"
		});
	});
	
	describe('#exec()', function() {
		it('should remove single comment in next line', function() {
			assert.equal( true, (cmd != undefined) );
			
			var compiled = cmd.exec( "\n // test" );
			assert.equal( "\n  test", compiled);
		});

		it('should remove single comment in next unix line', function() {
			assert.equal( true, (cmd != undefined) );
			
			var compiled = cmd.exec( "\n\r// test" );
			assert.equal( "\n\r test", compiled);
		});

		it('should remove single comment in next different line', function() {
			assert.equal( true, (cmd != undefined) );
			
			var compiled = cmd.exec( "\r\n// test" );
			assert.equal( "\r\n test", compiled);
		});

		it('should remove single comment in next different line', function() {
			assert.equal( true, (cmd != undefined) );
			
			var compiled = cmd.exec( "\r\n//test" );
			assert.equal( "\r\ntest", compiled);
		});
	});

});
