// IMPORT ALL THE DEPENDENCIES
// =============================================================
var error404     = require( "../errors/404" );
var VALID_ROUNDS = require( "../data/roundNums" );


// Define a middleware for validating the round present
// in the URL:
var validateRound = function( req, res, next ) {
	if( VALID_ROUNDS.indexOf( parseInt( req.params.round, 10 ) ) === -1 ) {
		// Invalid round, redirect to 404...
		error404( req, res, next );
	}
	else {
		next();
	}
};


module.exports = validateRound;