#!/usr/bin/env node

var cliArgs = process.argv.slice(2);

if( cliArgs.length != 2) {
    console.log( "[ERROR] please use 3 arguments in appbuildr." );
    console.log( "How to use: (parameter)" );
    console.log( "----------------------------------------------" );
    console.log( "[1.] buildr-command." );
    console.log( "[2.] project-description path (project.json)." );
}

var path = cliArgs[1];
console.log( "-- load project.json from path: " + path );

var project = require( path + "/project.json" );
console.log( "-- project ::: " +  project );

var cmd = cliArgs[ 0 ];

console.log('use cli-args: ', cliArgs );

var Buildr = require( __dirname + "/../lib/Buildr.js" );
var buildr = new Buildr( project.path.generated, project.path.templates );

var commandRegistry = project.buildr.on;

console.log( "-- command-registry loaded? " + commandRegistry );

var cmdTasks = commandRegistry[ cmd ];

if( !cmdTasks ) {
	console.log( "-- err : " + cmdTasks + ". no cmd-tasks found for command #" + cmd );
}

//-- to delete the complete project: buildr.deleteProject();
buildr.cleanup();

for( idx in cmdTasks ) {
	var task = cmdTasks[ idx ];
	buildr.use( task );
}

buildr.generate();

buildr.close();