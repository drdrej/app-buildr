
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
  = VAL:([a-zA-Z]+) { return VAL.join(""); }

id
  = VAL:([a-zA-Z]+)  { return VAL.join(""); }

mustacheID
  = VAL:([a-zA-Z]+)  { return VAL.join(""); }





/* ===== Whitespace ===== */

_ "whitespace"
  = whitespace*

whitespace
  = [ \t\n\r ]
  / " "