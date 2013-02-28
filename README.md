app-buildr
==========

Author: Andreas Siebert, ask@touchableheroes.com



## Attention:
This software is unstable. please use it carefuly.

## Description:
A code-generator to build apps. App-Buildr use templates and JavaScript 
to build boiler-plate-code for your apps. the concept is based on 
model-driven-architecture idea and templating.

## Usage

1. install appbuildr
2. create prototype-project
3. create/download transformers
4. declare model
5. fill project-files with macros
6. create app-model
7. generate app-boilerplate-code

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

´´´javascript
{
   "app" : {
   "modelVersion" : 1,
    
	"app" : {
      ...
   }
}

#### Templates




Before we start to work with appbuildr we need a prototype.


### API/JavaScript
To load appbuildr in nodejs use require-function.
```javascript
var appbuildr = require( "apbuildr" ); 
```


##License: 
MIT License (MIT).
For more information please check LICENSE.md file.
