appbuildr [closed|experimental]
==========
-- inspired by model-driven-architecture.

    state: experimental/closed
    Author: Andreas Siebert, ask@touchableheroes.com

## Attention:
[![Build Status](https://travis-ci.org/drdrej/app-buildr.png?branch=master)](https://travis-ci.org/drdrej/app-buildr)

This software is unstable. please use it carefuly.

## Description:
A code-generator to build apps. App-Buildr use templates and JavaScript 
to build boiler-plate-code for your apps. the concept is based on the idea of
model-driven-architecture and templating.

## Usage

1. install appbuildr
2. create prototype-project
3. create model
4. create transformers
5. enrich prototype-files with macros
6. generate app-boilerplate-code

### Where to use appbuildr?

I use appbuildr to create basic-structure of my android-apps and plan to use it in other projects also.

### Install

appbuildr is a nodejs based product. to use it in your dev-environment you need to install nodejs and npm.
after nodejs is installed use npm to install appbuildr.

    npm install appbuildr -g

### Create prototype-project
Appbuildr is a tool to copy and create files from templates based on a specified model.
Fist of all, before you start you will need a prototype-project. A prototype-project
is a project with some predefined files for your main-project. 

For example I use appbuildr to create boilerplate-code in my android-apps. To use it, i've created 
an android-prototype-project. In this eclipse-project I do all my "research-stuff" for the main-project. 
So, I config my settings, create some java-files and some xmls. And use all this stuff 
later in appbuildr to derive my final application from prototype.


### Create model

Model is a simple json-file. The structure of the model is based on prefered transformers. 
A model-file is your way to describe a solution. Here is an example of a model-file:

```javascript
    {
    "modelVersion" : 1,
    
    "app" : {
     ...
     
     "entities" : [
         { 
            "name"  : "MyEntity_1",
            "columns" : [ ... ] 
         
         },
         { 
            "name"  : "MyEntity_2",
            "columns" : [ ... ]
         
         },
         ...
     ]
    }
    }
```

Models will be validated and transformed into code by transformers. 


### Create transformrs

Transformr is a java-script-object declared in this way:
```javascript
module.exports = {
    
    // model-version. is important to validate later against the buildr and transformrs
    modelVersion : 1,
    
    // model-query:
    query : ".entities > *",
    
    // description, will be used to log:
	desc : "Create entities",

    // transformation.function:
	bind : function(entity, model) {	
       ...
	}
};

```


Example of a transformr to create entity-classes:

```javascript
module.exports = {
    modelVersion : 1,

	query : ".entities > *",
    
	desc : "Create entities",

	bind : function(entity, model) {	
		var fileModel = model.vfs;
		
        // create dir-structure:
		var dir = fileModel.dirs( pckgPath );
		var fileName = entity.name + ".java";
		
        // path to template-dir:
		var path = model.appDefinition.projectTemplate + "/templates";
		
        // append template-based file:
		dir.add("tmpl", fileName, "create java from template.",
				true, 
                {
					templatePath : path,
					template : "PrototypeEntity.java.tmpl",

					className : entity.name,
                    pckg      : "com.example.entities"
		});
	}
};

```

Transformers must be placed in a transformr-dir. Check example-code!



#### How to use templates in appbuildr?

Teplates are files enriched with [mustache-syntax] (http://mustache.github.com/) 
and use a suffix *.tmpl.


##### Create a class from template

For example in my apps I create database-entities for my android-apps based on a
template Entity.java.tmpl.

A template might look like this:


    package {{params.pckg}};
    
    public class {{params.entity}} extends Entity {
    ...
    }


I don't like template-files, because I can't use my favorised IDE to write them. For good-working syntax-highliting 
you have to use an editor with support for both languages: template- and source-language. 

My common way of building solutions is:

1. build a prototype
2. build template from prototype
3. build product from template

I've tried to rebuild this workflow in appbuildr. 

Appbuild supports some text-editing-macros to gives you a way to create 
templates directly from prototypes. An implemented pre-processor convert
prototype-files in a template. To modify the prototype-file appbuildr use 
macros (described later).

An example of a prototype-file written in Java Programming Language filled with macros:  

```java
package /* [#word with:{{params.pckg}} #]*/ com.example.prototype;

public class /* [#word with:{{params.className}} #] */ PrototypeEntity extends Entity {
...
}
```

In this example I've used a word-macro to replace the next word in text 
with a passed mustache-variable.


##### Preprocessor-Macros
Use built-in macros to simplify template-creation.

Predefined macros:

1. word - replace next word with a passed string or mustache-variable.
2. uncomment - uncomment the next commented line. 
WARNING: supports only java-single-comment '//' at this moment


### API/JavaScript

You can use appbuildr programmaticaly:

```javascript

// load appbuildr:
var Buildr = require( "apbuildr" ); 

// init appbuildr
var buildr = new Buildr("path/to/my/output/dir", 
		"path/to/my/prototype" );

// to delete the complete project use: 
// buildr.deleteProject();

// clean up only some dirs and files 
// to rebuild the most important stuff:
buildr.cleanup();

// -- call transformation "create-db-entities"
buildr.use( "create-db-entities" );

// generate the project:
buildr.generate();

buildr.close();
```

### Libraries and third-party-products

To create this project I have used different open-source-projects:

1. [JSONSelect] (http://jsonselect.org/#overview) - to select elements in the model.
2. [mu2] (https://github.com/raycmorgan/Mu) - to interpret mustache-syntax in my templates.
3. [wrench] (https://github.com/ryanmcgrath/wrench-js) - to work with directories.
4. [mocha] (http://visionmedia.github.com/mocha/) - to test
5. [pegjs] (http://pegjs.majda.cz/) - to implement the preprocessor-macro-parser.


##Links: 





##License: 
MIT License (MIT).
For more information please check LICENSE.md file.
