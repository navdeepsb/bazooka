// IMPORT ALL THE DEPENDENCIES
// =============================================================
var express        = require( "express" );
var TeamModel      = require( "./model" );
var modelUtils     = require( "../utils/modelUtils" );
var CUSTOM_CODE    = require( "../data/customCodes" );
var CUSTOM_MESSAGE = require( "../data/customMessages" );


// Initialize the router:
var router = express.Router();

// Other variables:
var TeamUtils = modelUtils( TeamModel );


// SET ROUTES
// =============================================================
router.get( "/teams", function( req, res, next ) {
	// Define the keys to be be get (space-separated):
	var selectClause = "name";

	// Now get all the teams using promise:
	TeamUtils.getAll( selectClause ).then( function( docs ) {
		res.status( 200 ).send({
			teams         : docs,
			customCode    : CUSTOM_CODE.OK,
			customMessage : CUSTOM_MESSAGE.OK
		});
	}).then( null, function( err ) {
		res.status( 500 ).send({
			customCode    : CUSTOM_CODE.ERROR,
			customMessage : CUSTOM_MESSAGE.ERROR
		});
	});
});


module.exports = router;