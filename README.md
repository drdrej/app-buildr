appbuildr
==========

Author: Andreas Siebert, ask@touchableheroes.com



## Attention:
This software is unstable. please use it carefuly.

## Description:
A code-generator to build apps. App-Buildr use templates and JavaScript 
to build boiler-plate-code for your apps. the concept is based on the idea of
model-driven-architecture and templating.

## Usage

1. install appbuildr
2. create prototype-project
3. create transformers
4. create project-model
5. enrich prototype-files with macros
6. generate app-boilerplate-code

### Where to use appbuildr?

I use appbuildr to create basic-structure of my android-apps and plan to use it in other projects also.

### Install

appbuildr is a nodejs based product. to use it in your dev-environment you need to install nodejs and npm.
after nodejs is installed use npm to install appbuildr.

    npm install appbuildr

### Create Prototype-Project
Appbuildr is a tool to copy and create files from templates based on a specified model.
Fist of all, before you start you will need a prototype-project. A prototype-project
is a project with some predefined files for your main-project. 

For example I use appbuildr to create boilerplate-code in my android-apps. To use it, i've created 
an android-prototype-project. In this eclipse-project I do all my "research-stuff" for the main-project. 
So, I config my settings, create some java-files for different solutions. And use all this stuff 
later in appbuildr to derive my main-rpoject from prototype.


#### Model

Model is a simple json-file. The structure of the model is based on used transformers. 

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

#### Templates

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
.

An example of a prototype-file:  

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
To load appbuildr in nodejs use require-function.
```javascript
var appbuildr = require( "apbuildr" ); 
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
