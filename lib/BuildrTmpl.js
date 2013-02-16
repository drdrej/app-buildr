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