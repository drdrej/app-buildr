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

// Class: BuildrTmpl

function BuildrTmpl() {
	// parser bauen:
};

/*


start
  = instruction

instruction
  = "//#" cmd:command " "+ holder:placeHolder { return cmd; } 
  " {{"+ with:placeHolder "}} " #//"
  

command
  = "for-each"

placeHolder
  = [a-zA-Z]+
  
  http://pegjs.majda.cz/online
  
 */

//https://github.com/ajaxorg/node-github
//https://github.com/dmajda/pegjs
BuildrTmpl.prototype.readOriginal = function( file ) {
	var parserConfig = {
		startCmd  : "//#",
		
		endCmd    : "#.",
		command   : {
			what  : null,
			how   : null,
			until : null
		}
	};
	
	// oeffnet einen
};

BuildrTmpl.prototype.prepare = function() {
	// stream einlesen und im stream
	// die commandos suchen:
	// comandos aufbauen und ausführen
	// d.h. im prototype aktiever code wird herausgenommen und ein
	// macro als replace verwendet.
	
};


module.exports = BuildrTmpl;