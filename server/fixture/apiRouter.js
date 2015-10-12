// IMPORT ALL THE DEPENDENCIES
// =============================================================
var router         = require( "express" ).Router();
var log            = require( "bole" )( "fixtureAPIRouter" );
var FixtureModel   = require( "./model" );
var modelUtils     = require( "../utils/modelUtils" );
var CUSTOM_CODE    = require( "../data/customCodes" );
var CUSTOM_MESSAGE = require( "../data/customMessages" );


// Variables:
var FixtureUtils = modelUtils( FixtureModel );


// SET ROUTES
// =============================================================

// GET /api/fixtures Returns all fixtures
router.get( "/fixtures", function( req, res, next ) {
	// Get the `round` query param:
	var round = parseInt( req.query.round );

	// Form the query:
	var query = {};

	if( !isNaN( round ) ) {
		query.round = round;
	}

	// The callback to be executed on promise getting resolved:
	var cb = function( docs ) {
		res.send({
			fixtures      : docs,
			customCode    : CUSTOM_CODE.OK,
			customMessage : CUSTOM_MESSAGE.OK
		});
	};

	// Now get all the fixtures using promise:
	FixtureUtils.getAll( query )
		.then( cb )
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "GET " + req.url + " Error occurred -", err );
			res.status( 500 ).send({
				status        : 500,
				fixtures      : [],
				customCode    : CUSTOM_CODE.ERROR,
				customMessage : CUSTOM_MESSAGE.ERROR
			});
		});
});

// GET /api/fixtures/:id Returns specific fixture
router.get( "/fixtures/:id", function( req, res, next ) {
	// Form the query:
	var query = { _id: req.params.id };

	// The callback to be executed on promise getting resolved:
	var cb = function( doc ) {
		res.send({
			fixture       : doc,
			customCode    : CUSTOM_CODE.OK,
			customMessage : CUSTOM_MESSAGE.OK
		});
	};

	// Now get the fixture using promise:
	FixtureUtils.getOne( query )
		.then( cb )
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "GET " + req.url + " Error occurred -", err );
			res.status( 500 ).send({
				status        : 500,
				fixture       : {},
				customCode    : CUSTOM_CODE.ERROR,
				customMessage : CUSTOM_MESSAGE.ERROR
			});
		});
});


module.exports = router;