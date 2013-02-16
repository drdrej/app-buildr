// buildr-main:
console.log( "test" );

var cliArgs = process.argv.slice(2);

var path = "C:/home/projects/android-mrtan/sources/sdk-apklib/android-prototype-app/architecture/buildr";

var project = require( path + "/project.json" );
console.log( "-- project ::: " +  project );

var cmd = null;
if( cliArgs.length == 1 ) {
	cmd = cliArgs[ 0 ];
} else {
    console.log( "check start options: you need a command" );	
    throw new Error( "restart with correct params" );
}

console.log('use cli-args: ', cliArgs );

var Buildr = require( "./Buildr.js" );


var buildr = new Buildr("C:/home/projects/android-mrtan/sources/android-playground", 
"C:/home/projects/android-mrtan/sources/sdk-apklib/android-prototype-app" );

var commandRegistry = project.buildr.on;

console.log( "-- command-registry loaded? " + commandRegistry );

var cmdTasks = commandRegistry[ cmd ];

if( !cmdTasks ) {
	console.log( "-- err : " + cmdTasks + ". no cmd-tasks found for command #" + cmd );
}

//-- to delete the complete project: buildr.deleteProject();

//clean up only some dirs and files to rebuild the most important stuff:
buildr.cleanup();

for( idx in cmdTasks ) {
	var task = cmdTasks[ idx ];
	buildr.use( task );
}

// -------------------------------------------------------
// ##  Example: API-Usage
// -------------------------------------------------------
////-- to delete the complete project: buildr.deleteProject();
//
////clean up only some dirs and files to rebuild the most important stuff:
//buildr.cleanup();
//
////tasks:
//buildr.use( "create-android-project" );
//buildr.use( "create-activities" );
//buildr.use( "create-icon-launcher" );
//buildr.use( "create-resources" );
//buildr.use( "copy-predefined-layouts" );
//buildr.use( "create-db-entities" );
//
////-- broken tasks :::
//buildr.use( "create-db-handler" );
//buildr.use( "create-labels-xml" );

//buildr.use( "create-layout" );

//## Generiert das Projekt :
buildr.generate();

buildr.close();



