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

/**
 * @author: Andreas Siebert
 */
module.exports = {
	modelVersion : 1,

	query : ".project > .app",
	desc : "Create basic project-structure",

	need : {
		app: {
			pckg : "com.example.pckg"
		}
	},
	
	bind : function(app, model) {
		var fm = model.vfs;

		var pckg = app.pckg;
		
		if (!pckg) {
			console.log("[ERROR] check app-model: app.pckg is not defined in app-model.");
			return false;
		}

		var path = pckg.replace(/\./g, "/");
		var dir = fm.dirs(path);
		
		var template = "App.java";
		var className = app.name + "App";
		var fileName = className + ".java";
		
		dir.add("tmpl", fileName, "create class from template.", true, {
			templatePath : model.appDefinition.projectTemplate
					+ "prototype/src/com/touchableheroes/appbuildr/java/example",
			template : template,

			pckg : app.pckg,
			className : className,
			msg : "Hello World"
		});

		return true;
	}
};
