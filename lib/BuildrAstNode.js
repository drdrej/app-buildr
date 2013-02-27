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
// ## Class ::: BuildrAstNode
// 
// author: Andreas Siebert 
//         ask@touchableheroes.com
// ------------------------------------------
var fs = require("fs");
var wrench = require('wrench');

String.prototype.endsWith = function(suffix) {
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

// --------------------------------------------
// -- Destination Pseudo-Ast is build by Nodes.
// --------------------------------------------
function Node(type, nodeId, desc, skipIfExists, params) {
	LOGGER.log("create ast node {node-id = " + nodeId + ", " + desc + " }");
	LOGGER.log("   use params: %j", params);
	LOGGER.log();

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
	LOGGER.log("try to add node { type = " + type + ", nodeId : " + nodeId
			+ ", desc = " + desc + ", skipIfExists = " + skipIfExists
			+ ", params = %j}", params);

	params = params == undefined ? {} : params;
	var node = new Node(type, nodeId, desc, skipIfExists, params);

	if (!node.isValid()) {
		LOGGER.log("[ERROR] Node-Object is not valid. Stop process.");
		throw new Error("Node-Object is not valid.");
	}

	var key = node.key();

	if (this.exists(key))
		return this.childrenIdx[key];

	this.children.push(node);
	this.childrenIdx[key] = node;

	return node;
};

Node.prototype.dir = function(nodeId) {
	return this.add("dir", nodeId, nodeId + "-directory", true);
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
	LOGGER.log("call generate() in path = " + parentPath);

	var path = parentPath + "/" + this.nodeId;

	var result = false;

	if (this.type == "dir") {
		LOGGER.log("create dir");
		result = this.createDir(path);

		for ( var idx in this.children) {
			var child = this.children[idx];
			child.generate(path);
		}
	} else if (this.type == "copy") {
		LOGGER.log("copy file");
		result = this.copyFile(parentPath);
	} else if (this.type === "copy-dir") {
		LOGGER.log("copy dir");
		this.copyDir(parentPath);
	} else if (this.type == "tmpl") {
		LOGGER.log("build from template");
		this.prepareTemplate();
		this.createFileFromTemplate(parentPath);
	} else {
		// LOGGER.log("[WARN] generation is not supported ")
		;
	}

	return result;
};

/**
 * use mu2-engine to parse templates.
 */
var mu = require("mu2");

Node.prototype.prepareTemplate = function() {
	if (this.params.template.endsWith(".tmpl"))
		return;

	var tmpl = this.params.templatePath + "/" + this.params.template;

	var MacroParser = require("./MacrosApi.js");
	var parser = new MacroParser();

	parser.preProcess(tmpl);

	return;

};

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
		LOGGER.log("[WARN] skip create file from template: {from: " + fromFile
				+ "}. Source-File doesn't exists.");
		return false;
	}

	if (!fs.existsSync(parentPath)) {
		LOGGER.log("[WARN] skip create file from template: {from: " + fromFile
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
		LOGGER.log("[WARN] couldn't create file {name : " + this.nodeId
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
	LOGGER.log("params in this object: %j", this.params);

	LOGGER.log("copy { file = " + fromFile + ", to = " + toPath + "}");

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
		LOGGER.log("[WARN] couldn't copy file { file : " + fromFile + "}");
		return false;
	}
};

Node.prototype.copyDir = function(toPath) {
	var from = this.params.fromPath + "/" + this.nodeId;
	var to = toPath + "/" + this.nodeId;

	wrench.copyDirSyncRecursive(from, to);
};

/**
 * @param path
 *            absolute path
 */
Node.prototype.createDir = function(path) {
	LOGGER.log("path :::: " + path);

	var result = false;
	try {
		result = fs.mkdirSync(path);
	} catch (e) {
		LOGGER.log("[WARN] exception skipped %j", e);
	}

	if (result || fs.existsSync(path)) {
		LOGGER.log("[SUCCESSFUL] create-dir: {path = " + path + "} ");
	} else {
		var msg = "[ERROR] create-dir: {path = " + path
				+ "} doesn't work. {result = " + result + "}";
		LOGGER.log(msg);

		throw Error(msg);
	}
};

// -- usefull extension-functions ::
Node.prototype.dirs = function(path) {
	LOGGER.log("create dirs: " + path);

	var splitted = path.split("/");

	if (!splitted) {
		var errMsg = "[ERROR] couldn't add path = " + path + " to node [= "
				+ this.nodeId + "]";
		LOGGER.log(errMsg);
		throw new Error(errMsg);
	}

	var cursor = this;
	for (idx in splitted) {
		var name = splitted[idx];

		if (!name) {
			var errMsg = "[ERROR] couldn't add path. path is invalid. position [= "
					+ idx + "] is empty.";
			LOGGER.log(errMsg);
			throw new Error(errMsg);
		}

		cursor = cursor.add("dir", name, "..", true);

		if (!cursor)
			throw new Error("Illegal State - cursor is undefined!");

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
	LOGGER.log("call BuildrAstNode( type = " + type + ", name = " + name
			+ ", desc = " + desc + " )");
	return new Node(type, name, desc, skipIfExists, params);
};