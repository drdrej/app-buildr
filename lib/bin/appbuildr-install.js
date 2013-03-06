/**
 * creates a appbuildr-basic-structure in a selected folder.
 * this script uses process.cdw() to get the destination folder.
 * 
 * IMPORTANT: this script should be called in a prototype-folder.
 *  
 * @author asiebert
 */


var LOGGER = require( "../Log.js" );
LOGGER.header( "APPBUILDR" );

var Buildr = require( "../Buildr.js" );
if( !Buildr ) {
	LOGGER.log( "couldn't load Buildr.js.");
}

var generatedPath = process.cwd();
LOGGER.log( "generate-to: " + generatedPath );

var draftPath = __dirname + "/../../draft";
LOGGER.log( "prototype-from: " + draftPath );


var buildr = new Buildr( generatedPath, 
		draftPath );

buildr.use( "sdk/create-directory-structure" );

//buildr.use( "create-appbuildr-basics" );

buildr.generate();

module.exports = {};
