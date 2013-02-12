/*   
  
   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

// ------------------------------------------
// ## Class ::: Buildr
// 
// author: Andreas Siebert 
//         ask@touchableheroes.com
// ------------------------------------------

var BuildrAstNode = require("./BuildrAstNode.js");

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
	
//	this.appendParent(this.appDefinition );
//	
//	console.log( "-- app-model has " + this.modelSize + " entries." );
//	console.log( "-- buildr has " + this.parentsAppended + " parents appendend" );
	
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
	console.log("===========================================");
	console.log("Project-Buildr (for Android-based projects)");
	console.log("Buildr-Version: ", this.version );
	console.log("Model-Version: ", this.model.modelVersion );
	console.log("===========================================");
};

Buildr.prototype._checkWSPath = function(wsPath) {
	if (fs.existsSync(wsPath)) {
		console.log("[SUCCESSFUL] check path exists: {path = " + wsPath + "}");
	} else {
		throw Error("ERROR: check path exists? false! {path = " + wsPath + "}");
	}
};

/**
 * transform the given model into the virtual file system model.
 */
Buildr.prototype.transform = function(path, fnc, comment) {
	console.log("-- add rule for path " + path
			+ " with transformation-function: " + comment);

	try {
		var selected = JSONSelect.match(path, this.model.appDefinition);

		if (selected == undefined || selected == null || selected == false) {
			console.log("[WARN] skip rule : " + comment);
			console.log("       found no model-nodes for query [= " + path
					+ "].");

			return;
		}

		for ( var i = 0; i < selected.length; i++) {
			if (fnc == null || fnc == undefined) {
				console
						.log("[WARN] skip execution of rule-function, because no function is defined for [rule = "
								+ comment + "]");
				return;
			}

			var success = fnc(selected[i], this.model);
			if (success != true) {
				console.log("[ABORTED] " + comment);
			} else {
				console.log("[SUCCESSFUL] " + comment);
			}
		}
	} catch (e) {
		console.log(e);
	}
};

/**
 * generate project files
 */
Buildr.prototype.generate = function() {
	console.log();
	console.log("Chapter: Generate files:");
	console.log("------------------------");

	this.model.vfs.generate(this.model.rootDir);
};

/**
 * delete all files in workspace
 */
Buildr.prototype.cleanUp = function() {
	console.log("-- clean up project." );
	console.log("-- project-dir = " + this.model.workspaceDir );
	
	wrench.rmdirSyncRecursive( this.model.workspaceDir, function(error, curFiles) {
	    if( error ) {
			console.log( "-- couldn't del dir. skip it. dir = " + curFiles + " with error: %j " + error );
			return;
		}
	});
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
		var msg = "[ERROR] couldn't find transformr: " + transformrPath;
		console.log( msg );
		console.log( e );
		throw new Error( msg );
	}
	
	if( !transformr ) {
		var msg = "[ERROR] couldn't find transformr: " + transformrPath;
		console.log( msg );
		throw new Error( msg );		
	}
	
	console.log( "-- try to load transformr: {name : " + transformrName + "}");
	
	if( !transformr ) {
		console.log( "-- couldn't execute transformr {name : " + transformrName + "}.");
		return;
	}
	
	if( !this.isTransformrValid( transformr ) ) {
		console.log( "-- loaded transformr is not valid {name : " + transformrName + " }. transformr-object = %j", transformr );
		return;
	}
	
	console.log();
	console.log("-- Chapter: Transformation - " + transformr.desc );
	console.log("----------------------------------------------------");

	this.transform( transformr.query, transformr.bind, transformr.desc );
};

Buildr.prototype.isTransformrValid = function ( transformr ) {
	var hasAttrs = (transformr.query && transformr.bind, transformr.desc );
	
	if( !hasAttrs ) {
		console.log( "[ERROR] missing attributes in transformr: bind, query or desc" );
		return false;
	}
	
	if( !transformr.modelVersion ) {
		console.log( "[ERROR] missing model-version in transformr." );
		return false;
	}
	
	if( transformr.modelVersion != this.model.appDefinition.modelVersion ) {
		console.log( "[ERROR] transformr is written for another model-version: " 
				+ this.model.appDefinition.modelVersion + ", current transformr-version: " 
				+ transformr.modelVersion);
		
		return false;
	}
	
	return true;
};


// ## public module interface :::
module.exports = Buildr;