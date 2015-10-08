// IMPORT ALL THE DEPENDENCIES
// =============================================================
var router         = require( "express" ).Router();
var log            = require( "bole" )( "teamAPIRouter" );
var TeamModel      = require( "./model" );
var modelUtils     = require( "../utils/modelUtils" );
var CUSTOM_CODE    = require( "../data/customCodes" );
var CUSTOM_MESSAGE = require( "../data/customMessages" );


// Variables:
var TeamUtils = modelUtils( TeamModel );


// SET ROUTES
// =============================================================

// GET /api/teams Returns all teams in first division
router.get( "/teams", function( req, res, next ) {
	// Form the query:
	var query = { inFirstDivision: true };

	// Select the keys to retrieve:
	var select = "name";

	if( req.query.select ) {
		// Ex. "name,stadium,city" => "name stadium city"
		select = req.query.select.replace( new RegExp( ",", "g" ), " " );
	}

	// The callback to be executed on promise getting resolved:
	var cb = function( docs ) {
		res.send({
			teams         : docs,
			customCode    : CUSTOM_CODE.OK,
			customMessage : CUSTOM_MESSAGE.OK
		});
	};

	// Now get all the teams using promise:
	TeamUtils.getAll( query, select )
		.then( cb )
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "GET " + req.url + " Error occurred -", err );
			res.status( 500 ).send({
				status        : 500,
				teams         : [],
				customCode    : CUSTOM_CODE.ERROR,
				customMessage : CUSTOM_MESSAGE.ERROR
			});
		});
});


module.exports = router;