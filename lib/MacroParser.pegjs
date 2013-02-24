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

start
  = "[#" command:cmdBlock _ "#]"  { return command; }

cmdBlock
  = NAME:commandName " " _ OPTS:options? { 
       if( OPTS ) {
	       return { 
	          "name": NAME, 
	          "params": OPTS 
	       };
	       
       } else {
		  return {
		     "name"   : NAME,
		     "params" : {}
		  };       
       }
  }
  /NAME:commandName {
       return {
	 "name"   : NAME,
	 "params" : {}
       };            
  }
  
commandName
  = NAME:([a-z]+) { return NAME.join( "" ); } 
  

options
  = HEAD:pair TAIL:(" " _ pair)* {
      var result = {};
      
      result[HEAD[0]] = HEAD[1];
      
      if( TAIL ) {
	      for (var i = 0; i < TAIL.length; i++) {
	        result [TAIL[i][2][0]] = TAIL[i][2][1];
	      }
      }
      return result;
  }
  
pair
 =  OPT:option _ ":" _ VALUE:value {
       return [OPT, VALUE];
   };

option
  = NAME:([a-z]+) { return NAME.join(""); }

eof
  = !.


/* ======== Values ================ */
value
  = VAL : id 
    { return VAL; }

  / '"' VAL:string '"' 
    { return VAL; }

  / "{{" VAL:mustacheID "}}" 
    { return "{{" + VAL + "}}"; }

string
  = VAL:(([a-zA-Z] / "." )+) { return VAL.join(""); }

id
  = VAL:([a-zA-Z]+)  { return VAL.join(""); }

mustacheID
  = VAL:(
     ([a-zA-Z] / "." )+)  { return VAL.join(""); }





/* ===== Whitespace ===== */

_ "whitespace"
  = whitespace*

whitespace
  = [ \t\n\r ]
  / " "