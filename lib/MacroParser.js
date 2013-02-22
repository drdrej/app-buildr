// mygenerator.js
//var Parser = require("jison").Parser;

var fs = require('fs');
console.log("[LOADLIB] module fs is imported: " + (fs != undefined));

var grammar = {
    "lex": {
        "rules": [
           ["\\s+",      "return 'SPACE';"],
           ["[a-f0-9]+", "return 'WORD';"]
        ]
    },

    "bnf": {
        "word" :[ "WORD SPACE word",
                         "WORD" ]
    }
};

var PEG = require("pegjs");
console.log("[LOADLIB] module pegjs is imported: " + (PEG != undefined));

function MacroPreProcessor( file, toFile ) {
	this.pos = {
		begin : 0
	};
	
	this.parserDescFile = __dirname +"/MacroParser.pegjs";
	this.parser = PEG.buildParser( this.readParserDesc() );
};

MacroPreProcessor.prototype.readParserDesc = function() {
	console.log("-- read preprocessor-parser-config-file: " + this.parserDescFile);
	return fs.readFileSync( this.parserDescFile, "utf8");
};

MacroPreProcessor.prototype.parse = function( txt ) {
	console.log( "-- start parser" );
	
	var parserResult = this.parser.parse( txt );
	
	var pos = txt.indexOf( "[#" ); // find command-start:
	
//	if( block.isCommand() )
	var str = txt.substr( this.pos.begin,  pos );
	
	console.log( "-- dump txt: " +  str );
	console.log( "-- got parser-result: %j", parserResult );
	
//	var result = {
//		output: 
//			[{
//				file: "",
//				data: ""
//			}]
//	};
	
	return parserResult;
};

MacroPreProcessor.prototype.grammar = grammar;

module.exports = MacroPreProcessor;


//{
//		grammar : grammar,
//		parse   : parse
//};

//
//var parser = new Parser(grammar);
//
//// generate source, ready to be written to disk
//var parserSource = parser.generate();
//
//// you can also use the parser directly from memory
//
//parser.parse("adfe34bc e82a");
//// returns true
//
//parser.parse("adfe34bc zxg");
//// throws lexical error