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
/**
 * @author asiebert
 */
console.log( "start appbuildr" );

var cliArgs = process.argv.slice(2);

if( cliArgs.length != 1) {
    console.log( "[ERROR] please use 3 arguments in appbuildr." );
    console.log( "How to use: " );
    console.log( "----------------------------------------------" );
    console.log( "project/path>appbuildr <command>" );
    console.log( "commands: is a command from project.json in path buildr.on.{?}" );
}

var path = process.cwd();
console.log( "-- load project.json from path: " + path );

var project = require( path + "/project.json" );
console.log( "-- project ::: " +  project );

var cmd = cliArgs[ 0 ];

console.log('use cli-args: ', cliArgs );

var Buildr = require( "../Buildr.js" );

var draftPath = (project.path.draft)? project.path.draft : process.cwd();
var generatedPath = (project.path.generated)? project.path.generated : process.cwd();
		
var buildr = new Buildr( generatedPath, draftPath );

var commandRegistry = project.buildr.on;

console.log( "-- command-registry loaded? " + commandRegistry );

var cmdTasks = commandRegistry[ cmd ];

if( !cmdTasks ) {
	console.log( "-- err : " + cmdTasks + ". no cmd-tasks found for command #" + cmd );
}

// -- to delete the complete project: buildr.deleteProject();
buildr.cleanup();

for( idx in cmdTasks ) {
	var task = cmdTasks[ idx ];
	buildr.use( task );
}

buildr.generate();

buildr.close();




module.exports = {};