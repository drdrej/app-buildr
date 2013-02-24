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

var MacroParser = require("../lib/MacroParser.js");
var mp = new MacroParser("", "");

describe('MacroParser', function() {

	describe('#parseCommand() form commands with no args', function() {
		it('uncomment-command with no args', function() {
			var commandStr = "[#uncomment#]";
			var result = mp.parseCommand(commandStr);

			assert.equal("uncomment", result.name);
		});

		it('uncomment-command with no args', function() {
			var commandStr = "[#uncomment #]";
			var result = mp.parseCommand(commandStr);

			assert.equal("uncomment", result.name);
		});
	});

	describe('#parseCommand() for commands with args', function() {

		it('replace command with one option AND word-syntax', function() {
			var commandStr = "[#replace with:xyz #]";
			var result = mp.parseCommand(commandStr);

			assert.equal("replace", result.name);
			assert.equal("xyz", result.params["with"]);
		});

		it('replace command with one option in string-syntax', function() {
			var commandStr = '[#replace with:"xyz" #]';
			var result = mp.parseCommand(commandStr);

			assert.equal("replace", result.name);
			assert.equal("xyz", result.params["with"]);

		});

		it('replace command with one option in mustache-syntax', function() {
			var commandStr = '[#replace with:{{xyz}} #]';
			var result = mp.parseCommand(commandStr);

			console.log( "parse.result ::: %j", result );
			assert.equal("replace", result.name);
			assert.equal("{{xyz}}", result.params["with"]);

		});

	});

	describe('#initCommand()', function() {
		it('init replace-command with one parameter ("with") ', function() {
			var cmd = mp.initCmd( "[#uncomment#]" );

			var valid = cmd.validate();
			console.log( "command  found ::: %j", cmd );

			assert.equal( true, valid.success );
			assert.equal("uncomment", cmd.name);
		});
		
		it('init replace-command with one parameter ("with") ', function() {
			var commandStr = "[#replace with:xyz #]";
			var result = mp.parseCommand(commandStr);

			assert.equal("replace", result.name);
			assert.equal("xyz", result.params["with"]);
			
		});

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

			var result = mp.preProcessContent('public class /*[#replace token : "BasicOpenDBHandler" with:"params.classNAme" #]    BasicOpenDBHandler extends',
					path);
			
			assert.equal(true, result);
		});
	});
	
});
