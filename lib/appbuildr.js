// buildr-main:

var cliArgs = process.argv.slice(2);
console.log('use cli-args: ', cliArgs );

var Buildr = require( "./Buildr.js" );

console.log( "-- buildr loaded: " + Buildr );

function AppBuildr() {
	
};


module.exports = AppBuildr;
