BUILDR_PATH = "C:/home/projects/android-mrtan/sources/sdk-apklib/app-buildr/script/lib";

var Buildr = require( BUILDR_PATH + "/Buildr.js" );
console.log( "-- buildr loaded: " + Buildr );

var buildr = new Buildr(BUILDR_PATH + "/example/gen", 
		BUILDR_PATH + "/example" );

buildr.deleteProject();

//kopiert aus dem source-folder die betroffene datei!
//erstellt eine Template-Datei!
//
//buildr.createTemplate();

buildr.use( "create-helloworld-java" );

buildr.generate();
