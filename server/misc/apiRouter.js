// IMPORT ALL THE DEPENDENCIES
// =============================================================
var router         = require( "express" ).Router();
var log            = require( "bole" )( "miscAPIRouter" );
var config         = require( "../config" );
var CUSTOM_CODE    = require( "../data/customCodes" );
var CUSTOM_MESSAGE = require( "../data/customMessages" );


// API routes
// =============================================================

// Current round # request
router.get( "/currentround", function( req, res, next ) {
	res.send({
		round      : config.app.currRound,
		customCode : CUSTOM_CODE.OK,
		message    : CUSTOM_MESSAGE.OK
	});
});

// Round progress request
router.get( "/roundinprogress", function( req, res, next ) {
	res.send({
		inProgress : config.app.isRoundInProgress,
		customCode : CUSTOM_CODE.OK,
		message    : CUSTOM_MESSAGE.OK
	});
});


module.exports = router;