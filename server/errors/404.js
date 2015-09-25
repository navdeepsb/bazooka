// IMPORT ALL THE DEPENDENCIES
// =============================================================
var log = require( "bole" )( "404" );


// Define and export the error handler:
module.exports = function( req, res, next ) {
	log.error( "Route - " + req.url );
	res.status( 404 ).render( "./errors/404", { title: "Error 404" } );
	return next();
};