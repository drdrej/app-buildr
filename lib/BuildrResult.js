// This class logs results

function Result() {
    this.warningCounter = 0;	
    this.successfulCounter = 0;
};

Result.prototype.appHeader = function( buildrVersion, modelVersion ) {
	console.log("===========================================");
	console.log("App-Buildr - builds apps from model" );
	console.log("Buildr-Version: ", buildrVersion );
	console.log("Model-Version: ", modelVersion );
	console.log("===========================================");
};

Result.prototype.chapter = function( name ) {
	console.log();
	console.log("Chapter: " + name);
	console.log("------------------------");
};

Result.prototype.log = function( msg ) {
	console.log( "-- " + msg );
};

/**
 *  Error, but skip it
 */
Result.prototype.warn = function( msg ) {
	this.warningCounter++;
	console.log( msg );
};

/**
 *  real problem. stop the app
 */
Result.prototype.problem = function( msg ) {
	console.log( "[ERROR] " + msg );
	throw new Error( msg );
};

Result.prototype.success = function( msg ) {
	this.successfulCounter++;
	console.log( "[SUCCESSFUL] " + msg );
};

Result.prototype.ready = function() {
	console.log( "" );
	console.log( "Chapter: Result" );
	console.log( "=================================================================" );
	
	console.log( "some App-creation-statistics." );
	console.log( "" );
	console.log( "WARNINGS: " + this.warningCounter );
	console.log( "SUCCESSFUL: " + this.successfulCounter );
	console.log( "");
	console.log( "Thank you!" );
};


module.exports = Result;
