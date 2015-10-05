// IMPORT ALL THE DEPENDENCIES
// =============================================================
var config   = require( "../config" );
var error404 = require( "../errors/404" );


// Constants:
var MAX_ROUNDS = 2 * ( ( config.app.teams || 20 ) - 1 );


// Define a middleware for validating the round present
// in the URL:
var validateRound = function( req, res, next ) {
	var currRound = req.params.round;

	if( currRound < 1 || currRound > MAX_ROUNDS ) {
		// Invalid round, redirect to 404...
		error404( req, res, next );
	}
	else {
		next();
	}
};


module.exports = validateRound;