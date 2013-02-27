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
var MacrosApi = require("../lib/MacrosApi.js");

describe('MacrosApi', function() {

	var mp = {};
	
	beforeEach(function(){
		mp = new MacrosApi("", "");
	});
	
	
	describe('#preProcessContent()', function() {
		it('found command-open-tag', function() {
			var path = __dirname + "/output.test";

			var result = mp.preProcessContent("dasdasdas[#replace", path);

			assert.equal("end-position is wrong", result.msg);
		});

		it('found command-open-tag', function() {
			var path = __dirname + "/output2.test";

			var result = mp.preProcessContent('this is a [#replace token:"test" with:"testcase" #]test.',
					path);
			
			assert.equal(true, result);
		});

	});

	
	describe('#preProcessContent()', function() {
		it('replace command with one option in mustache-syntax', function() {
			var path = __dirname + "/out-preprocess.test";

			var result = mp.preProcessContent('public class /*[#replace token : "MyPrototypeClass" with:"params.classNAme" #]    MyPrototypeClass extends',
					path);
			
			assert.equal(true, result);
		});
	});

	describe('#preProcessContent()', function() {
		it('replace multiple commands', function() {
			var path = __dirname + "/out-multiple-commands.test";

			var txt = 'public class /*[#word with:{{params.className}} #]*/ MyPrototypeClass extends /*[#word with:{{params.parent}} #]*/ParentClass { \n\r'; 
//				  + '  public static final void main( String[] args ) {\n\r' 
//				  + '/*[#uncomment #]*/ \n\r'
//				  + '//    Sytem.out.println( "Hello World!" ); \n\r'
//				  + '}}';

			
			var result = mp.preProcessContent(txt, path);

			var expected = 'public class /*[#word with:{{params.className}} #]*/ {{params.className}} extends /*[#word with:{{params.parent}} #]*/{{params.parent}} { \n\r'; 
//				  + '  public static final void main( String[] args ) {\n\r' 
//				  + '/*[#uncomment #]*/ \n\r'
//				  + '    Sytem.out.println( "Hello World!" ); \n\r'
//				  + '}}';

			assert.equal(true, result);
			
			var data = fs.readFileSync( path, "utf-8");
			assert.equal(expected, data);
		});
	});
	
});
