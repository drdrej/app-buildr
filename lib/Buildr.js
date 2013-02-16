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




// ------------------------------------------

// ## Class ::: Buildr
// 
// author: Andreas Siebert 
//         ask@touchableheroes.com
// ------------------------------------------
var Result = require( "./BuildrResult.js" );
var BuildrAstNode = require("./BuildrAstNode.js");

var buildrResult = new Result();


var JSONSelect = require("JSONSelect");
console.log("[LOADLIB] module JSONSelect is imported: "
		+ (JSONSelect != undefined));


var util = require('util');
console.log("[LOADLIB] module underscore is imported: " + (util != undefined));

var fs = require('fs');
console.log("[LOADLIB] module fs is imported: " + (fs != undefined));

var path = require('path');
console.log("[LOADLIB] module path is imported: " + (path != undefined));

var _ = require('underscore');
console.log("[LOADLIB] module underscore is imported: " + (_ != undefined));

var wrench = require('wrench');
console.log("[LOADLIB] module wrench is imported: " + (wrench != undefined));

/**
 * constructor to build a Model-object.
 * 
 * @param wsPath
 *            workspace-path of your app
 * @param model
 *            json-model to create your app
 * 
 * @returns this
 */
function Model(wsPath, model) {
	this.appDefinition = model;

	this.vfs = new BuildrAstNode("dir", "project-root-ws", "Project Root",
			true, {});

	this.rootDir = wsPath;
	this.workspaceDir = this.rootDir + "/" + this.vfs.nodeId;
	
	this.modelSize = 0;
	this.parentsAppended = 0;
	
// this.appendParent(this.appDefinition );
//	
// console.log( "-- app-model has " + this.modelSize + " entries." );
// console.log( "-- buildr has " + this.parentsAppended + " parents appendend"
// );
	
};


Model.prototype.appendParent = function( parent ) {
	if( !parent ) {
		var msg = "couldn't append parent, because a passed parent is undefined.";
		console.log( msg );
		throw new Error( msg );
	}
	
	this.modelSize = this.modelSize + 1;
	var isParentObject = typeof(parent) === "object";
	if( !isParentObject ) {
		console.log( "-- skip! parent is not an object. " + (typeof parent));
		return;
	}
	
	for( idx in parent ) {
		var current = parent[idx];
		var isCurrentObject = (typeof(current) === "object" );
		
		if( !current ) {
			console.log( "-- skip! property parent." + idx + " is undefined" );
			continue;
		}
		
		if( typeof current.backRef === "function" ) {
			console.log( "-- skip! property parent.[ " + idx +" ] has parrent." );
			return;
		}
		
		if( isCurrentObject ) {
			current.backRef = function() {
				return parent;
			};
			this.parentsAppended = this.parentsAppended + 1;
		}
		
		this.appendParent( current );
	}
};

/**
 * wrapper-method to hide selection mechanism.
 * 
 * @param query
 * @returns
 */
Model.prototype.select = function(query) {
	return JSONSelect.match(query, this.appDefinition);
};

/**
 * a buildr-app to build android prototypes based on java.
 */
function Buildr(rootDir, modelProjectDir) {
	this._checkWSPath( rootDir );
	this._checkWSPath( modelProjectDir );
	
	var modelPath = modelProjectDir + "/architecture/buildr/app-model.json"; 
	var modelFile = require( modelPath );
	
	this.model = new Model( rootDir, modelFile);
	
	this.model.appDefinition.projectTemplate = modelProjectDir;
	
	this.logAppHeader();
};

Buildr.prototype.logAppHeader = function() {
	buildrResult.appHeader(this.version, this.model.appDefinition.modelVersion);
};

Buildr.prototype._checkWSPath = function(wsPath) {
	var msg = "check path. path exists: {path = " + wsPath + "}";
	if (fs.existsSync(wsPath)) {
		buildrResult.success( msg );
	} else {
		buildrResult.problem( msg );
	}
};

/**
 * transform the given model into the virtual file system model.
 */
Buildr.prototype.transform = function(path, fnc, comment) {
	buildrResult.log("add rule for path " + path
			+ " with transformation-function: " + comment);

	try {
		var selected = JSONSelect.match(path, this.model.appDefinition);

		if (selected == undefined || selected == null || selected == false) {
			buildrResult.skip( "skip rule : " + comment );
			buildrResult.log( "found no model-nodes for query [= " + path + "].");

			return;
		}

		for ( var i = 0; i < selected.length; i++) {
			if (fnc == null || fnc == undefined) {
				buildrResult.skip("skip execution of rule-function, because no function is defined for [rule = "
								+ comment + "]");
				return;
			}

			var success = fnc(selected[i], this.model);
			if (success != true) {
				buildrResult.problem("abort rule: " + comment);
			} else {
				buildrResult.success( "rule xecuted" + comment);
			}
		}
	} catch (e) {
// console.log(e);
		buildrResult.log( "Error: " +  e );
	}
};

/**
 * generate project files
 */
Buildr.prototype.generate = function() {
	buildrResult.chapter( "Generate files" );

	this.model.vfs.generate(this.model.rootDir);
};

/**
 * delete all files in workspace
 */
Buildr.prototype.deleteProject = function() {
	buildrResult.log("delete project." );
	buildrResult.log("project-dir = " + this.model.workspaceDir );
	
	wrench.rmdirSyncRecursive( this.model.workspaceDir, function(error, curFiles) {
	    if( error ) {
	    	buildrResult.skip( "couldn't delete dir. skip it! dir = " + curFiles + " with error: %j " + error  );
			return;
		}
	});
};

/**
 * delete all files in workspace
 */
Buildr.prototype.cleanup = function() {
	buildrResult.log("clean up project." );
	buildrResult.log("project-dir = " + this.model.workspaceDir );
	
	var cleanups = this.model.appDefinition.cleanup;
	
	for( idx in cleanups ) {
		var cleanup = cleanups[idx];
		var dir = this.model.workspaceDir + "/" + cleanup;
		
		buildrResult.log( "cleanup dir: " + dir );
		wrench.rmdirSyncRecursive( dir, function(error, curFiles) {
		    if( error ) {
				buildrResult.skip( "couldn't del dir. skip it. dir = " + curFiles + " with error: %j " + error );
				return;
			}
		});		
	}

};


/**
 * use transformation declared in a module
 */
Buildr.prototype.use = function( transformrName ) {
	var transformrsPath = this.model.appDefinition.projectTemplate;
	var transformrPath = transformrsPath + "/architecture/buildr/transformrs/" + transformrName + ".js";
	
	var transformr = null;
	
	try {
		transformr = require( transformrPath );
	} catch ( e ) {
		buildrResult.problem( "couldn't find transformr: " + transformrPath );
	}
	
	if( !transformr ) {
		buildrResult.problem("couldn't find transformr: " + transformrPath);
	}
	
	buildrResult.log( "try to load transformr: {name : " + transformrName + "}");
	
	if( !transformr ) {
		buildrResult.log( "couldn't execute transformr {name : " + transformrName + "}.");
		return;
	}
	
	if( !this.isTransformrValid( transformr ) ) {
		buildrResult.log( "loaded transformr is not valid {name : " + transformrName + " }. transformr-object = %j", transformr );
		return;
	}

	
	buildrResult.chapter( "Transformation - " + transformr.desc );
	
	this.transform( transformr.query, transformr.bind, transformr.desc );
};

Buildr.prototype.isTransformrValid = function ( transformr ) {
	var hasAttrs = (transformr.query && transformr.bind, transformr.desc );
	
	if( !hasAttrs ) {
		buildrResult.problem( "missing attributes in transformr: bind, query or desc" );
		return false;
	}
	
	if( !transformr.modelVersion ) {
		buildrResult.problem( "missing model-version in transformr." );
		return false;
	}
	
	if( transformr.modelVersion != this.model.appDefinition.modelVersion ) {
		buildrResult.problem( "[ERROR] transformr is written for another model-version: " 
				+ this.model.appDefinition.modelVersion + ", current transformr-version: " 
				+ transformr.modelVersion);
		
		return false;
	}
	
	return true;
};

Buildr.prototype.close = function() {
	buildrResult.ready();
};

// ## public module interface :::
module.exports = Buildr;