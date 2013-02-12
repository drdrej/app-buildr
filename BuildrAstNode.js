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
// ## Class ::: BuildrAstNode
// 
// author: Andreas Siebert 
//         ask@touchableheroes.com
// ------------------------------------------

var fs = require("fs");
var wrench = require('wrench');

// --------------------------------------------
// -- Destination Pseudo-Ast is build by Nodes.
// --------------------------------------------
function Node(type, nodeId, desc, skipIfExists, params) {
	console.log("-- create ast node {node-id = " + nodeId + ", " + desc + " }");
	console.log("   use params: %j", params);
	console.log();

	// ## Attributes ##
	this.type = type;
	this.nodeId = nodeId;
	this.desc = desc;
	this.params = params;

	/* additional children ::: */
	this.children = [];
	this.childrenIdx = {};
};

// -- Node-Functions: --
Node.prototype.exists = function(nodeId) {
	var backRef = this.childrenIdx[nodeId];
	return (backRef != null && backRef != false && backRef != undefined);
};

Node.prototype.checkIsEmpty = function(variable, notExistsDesc) {
	if (!variable || variable == false || variable == undefined)
		throw new Error(notExistsDesc);
};

/**
 * check the basic properties and functions of this important object. basic
 * constraints for an ast-node!
 */
Node.prototype.isValid = function() {
	this.checkIsEmpty(this.type,
			"[ERROR] every node needs a TYPE. currently 2 types supported.");
	this.checkIsEmpty(this.nodeId,
			"[ERROR] every node needs an ID. current not has no nodeId! {type = "
					+ this.type + "}");
	this.checkIsEmpty(this.desc,
			"[ERROR] every node must have a description. {nodeId = "
					+ this.nodeId + "}");

	return true;
};

/**
 * 
 * @param type
 *            supported node-type (dir, copy)
 * 
 * @param nodeId
 *            name or id of the node
 * @param desc
 *            human-readable description of this node.
 * @param skipIfExists
 *            what to do if node exists (true: node creation will be skiped)
 * 
 * @param params
 * 
 * @returns
 */
Node.prototype.add = function(type, nodeId, desc, skipIfExists, params) {
	console.log("-- try to add node { type = " + type + ", nodeId : " + nodeId
			+ ", desc = " + desc + ", skipIfExists = " + skipIfExists
			+ ", params = %j}", params);
	
	params = params == undefined ? {} : params;
	var node = new Node(type, nodeId, desc, skipIfExists, params);

	if (!node.isValid()) {
		console.log("[ERROR] Node-Object is not valid. Stop process.");
		throw new Error( "Node-Object is not valid." );
	}

	var key = node.key();

	if (this.exists(key))
		return this.childrenIdx[key];

	this.children.push(node);
	this.childrenIdx[key] = node;

	return node;
};


Node.prototype.dir = function( nodeId ) {
	return this.add( "dir", nodeId, nodeId + "-directory", true );
};

Node.prototype.key = function() {
	return this.nodeId;
};

/**
 * 
 * @param parentPath
 *            to build files in sub-dir!
 */
Node.prototype.generate = function(parentPath) {
	console.log("-- call generate() in path = " + parentPath);

	var path = parentPath + "/" + this.nodeId;

	var result = false;

	if (this.type == "dir") {
		console.log("-- create dir");
		result = this.createDir(path);

		for ( var idx in this.children) {
			var child = this.children[idx];
			child.generate(path);
		}
	} else if (this.type == "copy") {
		console.log("-- copy file");
		result = this.copyFile(parentPath);
	} else if (this.type === "copy-dir" ) { 
	    console.log( "-- copy dir" );
	    this.copyDir( parentPath );
    } else if (this.type == "tmpl") {
		console.log("-- build from template");
		this.createFileFromTemplate(parentPath);
	} else {
		// console.log("[WARN] generation is not supported ")
		;
	}

	return result;
};

/**
 * use mu2-engine to parse templates.
 */
var mu = require("mu2");

/**
 * 
 * @param parentPath
 * @returns {Boolean}
 */
Node.prototype.createFileFromTemplate = function(parentPath) {

	// ## prepare file-names :
	var fromFile = this.params.templatePath + "/" + this.params.template;
	var toFile = parentPath + "/" + this.nodeId;

	if (!fs.existsSync(fromFile)) {
		console.log("[WARN] skip create file from template: {from: " + fromFile
				+ "}. Source-File doesn't exists.");
		return false;
	}

	if (!fs.existsSync(parentPath)) {
		console.log("[WARN] skip create file from template: {from: " + fromFile
				+ "}. Destination-Path doesn't exists.");
		return false;
	}

	try {
		mu.root = this.params.templatePath;

		
		var inStr = mu.compileAndRender(this.params.template, this);
		var outStr = fs.createWriteStream(toFile);

		inStr.pipe(outStr);

		return true;
	} catch (err) {
		console.log("[WARN] couldn't create file {name : " + this.nodeId
				+ " } from template { template = " + fromFile + "}. err: %j ",
				err);
		return false;
	}
};


/**
 * 
 * @param toPath
 * @returns {Boolean}
 */
Node.prototype.copyFile = function(toPath) {
	var fromFile = this.params.fromPath + "/" + this.nodeId;
	console.log("-- params in this object: %j", this.params);

	console.log("-- copy { file = " + fromFile + ", to = " + toPath + "}");

	try {

		if (!fs.existsSync(fromFile)) {
			console
					.log("[WARN] source-file does not exists, skip this copy-process");
			return false;
		}

		if (!fs.existsSync(toPath)) {
			console
					.log("[WARN] destination-dir does not exists, skip this copy-process");
			return false;
		}

		var inStr = fs.createReadStream(fromFile);

		var toFile = toPath + "/" + this.nodeId;
		var outStr = fs.createWriteStream(toFile);

		inStr.pipe(outStr);

		return true;
	} catch (e) {
		console.log("[WARN] couldn't copy file { file : " + fromFile + "}");
		return false;
	}
};

Node.prototype.copyDir = function( toPath ) {
	var from = this.params.fromPath + "/" + this.nodeId;
    var to = toPath + "/" + this.nodeId;
    
	wrench.copyDirSyncRecursive( from, to );
};

/**
 * @param path
 *            absolute path
 */
Node.prototype.createDir = function(path) {
	console.log( "-- path :::: " + path );
	
	var result = false;
	try {
		result = fs.mkdirSync(path);
	} catch (e) {
		console.log("[WARN] exception skipped %j", e);
	}

	if (result || fs.existsSync(path)) {
		console.log("[SUCCESSFUL] create-dir: {path = " + path + "} ");
	} else {
		var msg = "[ERROR] create-dir: {path = " + path
				+ "} doesn't work. {result = " + result + "}";
		console.log(msg);

		throw Error(msg);
	}
};

// -- usefull extension-functions ::
Node.prototype.dirs = function ( path ) {
	console.log("-- create dirs: " + path );
	
	var splitted = path.split("/");
	
	if( !splitted ) {
		var errMsg = "[ERROR] couldn't add path = " + path + " to node [= " + this.nodeId + "]";
		console.log( errMsg );
		throw new Error( errMsg );
	}

	var cursor = this;
	for( idx in splitted ) {
		var name = splitted[ idx ];
		
		if( !name ) {
			var errMsg = "[ERROR] couldn't add path. path is invalid. position [= " + idx + "] is empty."; 
			console.log( errMsg );
			throw new Error( errMsg );
		}
		
		
		cursor = cursor.add( "dir", name, "..", true );
		
		if( !cursor )
			throw new Error( "Illegal State - cursor is undefined!" );
		
	}
	
	return cursor;
};

/**
 * public module method to create nodes.
 * 
 * @param type
 * @param name
 * @param desc
 * @param skipIfExists
 * @param params
 * @returns {Node}
 */
module.exports = function BuildrAstNode(type, name, desc, skipIfExists, params) {
	console.log("-- call BuildrAstNode( type = " + type + ", name = " + name
			+ ", desc = " + desc + " )");
	return new Node(type, name, desc, skipIfExists, params);
};