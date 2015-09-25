// IMPORT ALL THE DEPENDENCIES
// =============================================================
var log = require( "bole" )( "500" );


// Define and export the handler:
module.exports = function( err, req, res, next ) {
	log.error( "Route - " + req.url + "; Error - " + err );
	res.status( 500 ).render( "./errors/500", { error: err, title: "Error"  } );
	return next( err );
};