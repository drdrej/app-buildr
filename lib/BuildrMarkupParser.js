

function BuildrMarkupParser( skipChars ) {
	this.skipChars = skipChars;
};

BuildrMarkupParser.prototype.parse = function( file ) {
	
	//beispiel :::
    if (result3 !== null) {
        if (input.substr(pos.offset, 3) === "#*/") {
          result4 = "#*/";
          advance(pos, 3);
        } else {
	
	// TODO: use streams later
	fs.readFile( file, "utf-8", function (err, data) {
		  if (err) 
			  throw err;
		  
		  console.log( "--read file: " + file );
		  console.log(data);
		  
		  var startInstrPos = data.indexOf( "[#" );
	      var endInstrPos = data.  
		  
	});
//	 var readStream = fs.createReadStream(filename);
	 
//	 var buffer = "";
//	 
//	 var inStream = fs.createReadStream( file, {
//		 encoding: 'utf8'
//	 });
//	 
//	 // examples from nodejitsu -- please remove :::
////	  // This will wait until we know the readable stream is actually valid before piping
////	  readStream.on('open', function () {
////	    // This just pipes the read stream to the response object (which goes to the client)
////	    readStream.pipe(res);
////	  });
////
////	  // This catches any errors that happen while creating the readable stream (usually invalid names)
////	  readStream.on('error', function(err) {
////	    //res.end(err);
////	  });
////		istream.once("end", function() {
////		    console.log("Hit end of file");
////		});
////		  
////		readStream.on('end', function() {
////		  writestream.end()
////		});	  
//
//	 
//	inStream.on( "data", function(data) {
//		
//		data.indexOf(  );
//	    console.log(data);
//	});

}

module.exports = BuildrMarkupParser;

