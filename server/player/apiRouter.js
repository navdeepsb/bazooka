// IMPORT ALL THE DEPENDENCIES
// =============================================================
var router         = require( "express" ).Router();
var log            = require( "bole" )( "playerAPIRouter" );
var PlayerModel    = require( "./model" );
var modelUtils     = require( "../utils/modelUtils" );
var CUSTOM_CODE    = require( "../data/customCodes" );
var CUSTOM_MESSAGE = require( "../data/customMessages" );


// Variables:
var PlayerUtils = modelUtils( PlayerModel );


// SET ROUTES
// =============================================================

// GET /api/players Returns all players
// NOTE:
// This API accepts query parameters too for filtering
// Only valid parameters are considered.
// Ex. GET /api/players?position=G
//     This will fetch all players having "G" position
//     This is EXACT searching.
// Ex. GET /api/players?name=*nav
//     This will fetch all players having "nav" string
//     in their names. This is LIKE searching.
router.get( "/players", function( req, res, next ) {
	// Form the query:
	var query = {};

	var defPlayer = PlayerUtils.getDefaultModel();
	for( var key in req.query ) {
		var val = req.query[ key ];
		// Entertain only truthy and valid keys:
		if( val && key in defPlayer ) {
			// Now decide whether LIKE search or EXACT search:
			if( val.indexOf( "*" ) === 0 ) {
				// Value begins with `*`, LIKE search
				query[ key ] = new RegExp( val.substr( 1 ), "i" );
			}
			else {
				// EXACT search:
				query[ key ] = val;
			}
		}
	}

	// Select the keys to retrieve:
	var select = "name team jerseyNum position status";

	// The callback to be executed on promise getting resolved:
	var cb = function( docs ) {
		res.send({
			players       : docs,
			customCode    : CUSTOM_CODE.OK,
			customMessage : CUSTOM_MESSAGE.OK
		});
	};

	// Now get all the players using promise:
	PlayerUtils.getAll( query, select )
		.then( cb )
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "GET " + req.url + " Error occurred -", err );
			res.status( 500 ).send({
				status        : 500,
				players       : [],
				customCode    : CUSTOM_CODE.ERROR,
				customMessage : CUSTOM_MESSAGE.ERROR
			});
		});
});


module.exports = router;