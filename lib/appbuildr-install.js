/**
 * creates a appbuildr-basic-structure in a selected folder.
 * this script uses process.cdw() to get the destination folder.
 * 
 * IMPORTANT: this script should be called in a prototype-folder.
 *  
 * @author asiebert
 */



var LOGGER = require( "./lib/Log.js" );
var Buildr = require( "./lib/Buildr.js" );

if( !Buildr ) {
	LOGGER.log( "couldn't load Buildr.js.");
}

var path = process.cwd();

var buildr = new Buildr( path, 
		path );

buildr.use( "create-directory-structure" );
//buildr.use( "create-appbuildr-basics" );

buildr.generate();

module.exports = {};
