appbuildr
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
"modelVersion" : 1,
    
"app" : {
...
}
}
´´´

#### Templates

Teplates are files enriched with [mustache-syntax] (http://mustache.github.com/) 
and use a suffix *.tmpl.


##### Create a class from template

For example in my apps i create database-entities for my android-apps based on a
template Entity.java.tmpl.

A template might look like this:


    package {{params.pckg}};
    
    public class {{params.entity}} extends Entity {
    ...
    }


I don't like template-files, because I can't use my favorised IDE to write them. To have a good-working syntax-highliting 
a used editor must support both languages: template- and source-language. 

My common way of building solutions is:
1. build a prototype
2. build template from prototype
3. build something from template

Appbuild supports some text-editing-macros to gives you a way to create 
templates directly from prototypes. An implemented pre-processor convert
prototype-files in a template, based on used macros.

An example of a prototype-file:  

```java
package /*[#word with:{{params.pckg}}]*/ com.example.prototype;

public class /*[#word with:{{params.className}}]*/ PrototypeEntity extends Entity {
...
}
```

##### Preprocessor-Macros
Use built-in macros to simplify template-creation.

Predefined macros:
1. word
2. uncomment
3. ... 







4. , which (f.e. Eclipse or NetBeans) 
to create my template-code.



Before we start to work with appbuildr we need a prototype.


### API/JavaScript
To load appbuildr in nodejs use require-function.
```javascript
var appbuildr = require( "apbuildr" ); 
```


##License: 
MIT License (MIT).
For more information please check LICENSE.md file.
