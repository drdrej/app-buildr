var assert = require("assert");

//var parser = require( "../lib/BuildrMacroParser.js" );
var MacroParser = require( "../lib/MacroParser.js" );
//var grammar = MacroParser.grammar;

//var Parser = require("jison").Parser;

describe('BuildrMacroParser', function(){
  describe('#parse()', function(){
    
	it('replace command with one option AND word-syntax', function() {
		var mp = new MacroParser( "", "" );
		
		// -- single output commands :::
		// test: replace next word with mustache-command
		var commandStr = "[#replace with:xyz ]";
		var result = mp.parse( commandStr );
		console.log( "-- result: %j" + result );
		
		var output = result.output[0];
		
		assert.equal( true, output.data);
    });

	it('replace command with one option in string-syntax', function() {
		var mp = new MacroParser( "", "" );
		
		// -- single output commands :::
		// test: replace next word with mustache-command
		var commandStr = '[#replace with:"xyz" ]';
		var result = mp.parse( commandStr );
		console.log( "-- result: %j" + result );
		
		var output = result.output[0];
		
		assert.equal( true, output.data);
    });
	
  });
  
});
