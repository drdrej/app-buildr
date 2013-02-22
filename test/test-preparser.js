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

	describe('#preProcessContent()', function() {
		it('found command-open-tag', function() {
			var path = __dirname + "/output.test";

			var result = mp.preProcessContent("dasdasdas[#sadasdasdas", path);

			assert.equal("end-position is wrong", result.msg);
			// assert.equal( "xyz", result.params[ "with" ] );
		});

		it('found command-open-tag', function() {
			var path = __dirname + "/output2.test";

			var result = mp.preProcessContent("dasdasdas[#sadasdasdas #]asd",
					path);
			
			assert.equal(true, result);
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



});
