// Transformation-example :::
module.exports = {
	modelVersion : 1,

	query : ".classDesc > *",
	desc : "Create java-file",

	bind : function(classDesc, model) {
		
		var fileModel = model.vfs;
		
		var pckgPath = classDesc.pckg.replace( /\./g, "/" );
		
		var dir = fileModel.dirs( pckgPath );
		var fileName = classDesc.name + ".java";
		
		var path = model.appDefinition.projectTemplate + "/templates";
		
		console.log( "----- MODEL-PATH: %j", model );
		
		console.log( "path : " + path );
		
		dir.add("tmpl", fileName, "create Java from template.",
				true, {
					templatePath : path,
					template : "HelloWorld.java.tmpl",

					classDesc : classDesc
		});
	}
};
