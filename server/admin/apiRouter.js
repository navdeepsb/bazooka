// IMPORT ALL THE DEPENDENCIES
// =============================================================
var router          = require( "express" ).Router();
var log             = require( "bole" )( "adminAPIRouter" );
var mongooseTypes   = require( "mongoose" ).Types;
var AdminModel      = require( "./model" );
var PlayerModel     = require( "../player/model" );
var TeamModel       = require( "../team/model" );
var authenticate    = require( "../middlewares/authenticateAdmin" );
var modelUtils      = require( "../utils/modelUtils" );
var CUSTOM_CODE     = require( "../data/customCodes" );
var CUSTOM_MESSAGE  = require( "../data/customMessages" );
var VALID_POSITIONS = require( "../data/playingPositions" );
var VALID_STATUS    = require( "../data/playerStatus" );


// Define the model utils:
var AdminUtils  = modelUtils( AdminModel );
var PlayerUtils = modelUtils( PlayerModel );
var TeamUtils   = modelUtils( TeamModel );


// SET ROUTES
// =============================================================

// Admin login request
router.post( "/login", function( req, res, next ) {
	// Form the query:
	var query = { username: req.body.username, password: req.body.password };

	// Select the keys to retrieve:
	var select = "-password";

	// The callback to be executed on promise getting resolved:
	var cb = function( doc ) {
		if( doc ) {
			// Set the admin info in the session:
			req.session.admin = doc;

			// And redirect to the admin panel:
			res.redirect( "/admin/panel" );

			log.info( "Admin @" + req.session.admin.username + " logged in" );
		}
		else {
			// Invalid credentials
			res.send({ message: CUSTOM_MESSAGE.INVALID_CREDENTIALS });
		}
	};

	// Find the document now:
	AdminUtils.getOne( query, select )
		.then( cb )
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "POST " + req.url + " Error occurred -", err );
			res.send({ message: CUSTOM_MESSAGE.ERROR });
		});
});

// Save team request
router.post( "/team", authenticate, function( req, res, next ) {
	var body = req.body;

	// Change the checkbox value from 'on' to boolean:
	body.inFirstDivision = body.inFirstDivision ? true : false;

	// Assign an object id to _id if it doesn't exit:
	// This is safe because the newly generated id will not match
	// any existing ids and consequently, the object will get
	// inserted/created as expected.
	if( !body._id ) {
		body._id = mongooseTypes.ObjectId();
		log.info( "Admin @" + req.session.admin.username + " creating a new team" );
	}
	else {
		log.info( "Admin @" + req.session.admin.username + " updating a team" );
	}

	// Form the query:
	var query = { _id: body._id };

	// The callback to be executed on promise getting resolved:
	var cb = function( doc ) {
		log.info( "Admin @" + req.session.admin.username + " saved team ", {
			_id  : body._id,
			name : body.name
		});
		res.redirect( "/admin/team/read" );
	};

	// Update/insert the team using promise:
	TeamUtils.upsert( query, body )
		.then( cb )
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "POST " + req.url + " Error occurred -", err );
			res.send({ message: CUSTOM_MESSAGE.ERROR });
		});
});

// Save player request
router.post( "/player", authenticate, function( req, res, next ) {
	var body = req.body;

	// Assign an object id to _id if it doesn't exit:
	// This is safe because the newly generated id will not match
	// any existing ids and consequently, the object will get
	// inserted/created as expected.
	if( !body._id ) {
		body._id = mongooseTypes.ObjectId();
		log.info( "Admin @" + req.session.admin.username + " creating a new player" );
	}
	else {
		log.info( "Admin @" + req.session.admin.username + " updating a player" );
	}

	// Form the query:
	var query = { _id: body._id };

	// The callback to be executed on promise getting resolved:
	var cb = function( doc ) {
		log.info( "Admin @" + req.session.admin.username + " saved player ", {
			_id  : body._id,
			name : body.name
		});
		res.redirect( "/admin/player/read" );
	};

	// Update/insert the player using promise:
	PlayerUtils.upsert( query, body )
		.then( cb )
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "POST " + req.url + " Error occurred -", err );
			res.send({ message: CUSTOM_MESSAGE.ERROR });
		});
});


module.exports = router;