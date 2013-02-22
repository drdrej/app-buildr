var assert = require("assert");

var MacroParser = require( "../lib/MacroParser.js" );
var mp = new MacroParser( "", "" );

describe( 'MacroParser', function(){
  describe('#parse()', function(){
    
	it('replace command with one option AND word-syntax', function() {
		var commandStr = "[#replace with:xyz #]";
		var result = mp.parseCommand( commandStr );
		
		assert.equal( "replace", result.name );
		assert.equal( "xyz", result.params[ "with" ] );
    });

	it('replace command with one option in string-syntax', function() {
		var commandStr = '[#replace with:"xyz" #]';
		var result = mp.parseCommand( commandStr );
		
		assert.equal( "replace", result.name );
		assert.equal( "xyz", result.params[ "with" ] );
		
    });

	it('replace command with one option in mustache-syntax', function() {
		var commandStr = '[#replace with:{{xyz}} #]';
		var result = mp.parseCommand( commandStr );
		
		assert.equal( "replace", result.name );
		assert.equal( "{{xyz}}", result.params[ "with" ] );
		
    });
	
  });

//  var commandStr = "some text [#replace with:xyz ] word some text";
//	var result = mp.preProcessContent( commandStr );
	
  
  describe('#preProcessContent()', function(){
		it( 'found command-open-tag', function() {
			var path = __dirname + "/output.test";
			
			var result = mp.preProcessContent("dasdasdas[#sadasdasdas", path);
		
			assert.equal( "end-position is wrong", result.msg );
//			assert.equal( "xyz", result.params[ "with" ] );
	    });


	  });

});

