// IMPORT ALL THE DEPENDENCIES
// =============================================================
var router            = require( "express" ).Router();
var log               = require( "bole" )( "adminAPIRouter" );
var AdminModel        = require( "./model" );
var PlayerModel       = require( "../player/model" );
var TeamModel         = require( "../team/model" );
var FixtureModel      = require( "../fixture/model" );
var TeamHelpers       = require( "../team/utils" );
var authenticate      = require( "../middlewares/authenticateAdmin" );
var modelUtils        = require( "../utils/modelUtils" );
var updateTeamHistory = require( "./updateTeamHistory" );
var CUSTOM_CODE       = require( "../data/customCodes" );
var CUSTOM_MESSAGE    = require( "../data/customMessages" );
var VALID_POSITIONS   = require( "../data/playingPositions" );
var VALID_STATUS      = require( "../data/playerStatus" );


// Define the model utils:
var AdminUtils   = modelUtils( AdminModel );
var PlayerUtils  = modelUtils( PlayerModel );
var TeamUtils    = modelUtils( TeamModel );
var FixtureUtils = modelUtils( FixtureModel );


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

	log.debug( "Admin @" + req.session.admin.username + " " + ( body._id ? "updating" : "creating" ) + " a team" );

	// Form the query:
	var query = { _id: body._id };

	// The callback to be executed on promise getting resolved:
	var cb = function( doc ) {
		log.info( "Admin @" + req.session.admin.username + " saved team", {
			_id  : doc._id,
			name : doc.name
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

// Save team by raw JSON input request
router.post( "/teamRaw", authenticate, function( req, res, next ) {
	var body = null;

	log.debug( "Admin @" + req.session.admin.username + " saving teams using raw JSON" );

	try {
		// `body` will be array of docs
		body = JSON.parse( req.body.json );
	}
	catch( ex ) {
		log.error( "POST " + req.url + " Invalid JSON!" );
		return next();
	}

	// The callback to be executed on promise getting resolved:
	var cb = function( docs ) {
		log.info( "Admin @" + req.session.admin.username + " saved " + docs.length + " teams using raw JSON" );
		res.redirect( "/admin/team/read" );
	};

	// Update/insert the team using promise:
	TeamUtils.bulkInsert( body )
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

	log.debug( "Admin @" + req.session.admin.username + " " + ( body._id ? "updating" : "creating" ) + " a player" );

	// Form the query:
	var query = { _id: body._id };

	// The callback to be executed on promise getting resolved:
	var cb = function( doc ) {
		log.info( "Admin @" + req.session.admin.username + " saved player", {
			_id  : doc._id,
			name : doc.name
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

// Save team by raw JSON input request
router.post( "/playerRaw", authenticate, function( req, res, next ) {
	var body = null;

	log.debug( "Admin @" + req.session.admin.username + " saving players using raw JSON" );

	try {
		// `body` will be array of docs
		body = JSON.parse( req.body.json );
	}
	catch( ex ) {
		log.error( "POST " + req.url + " Invalid JSON!" );
		return next();
	}

	// The callback to be executed on promise getting resolved:
	var cb = function( docs ) {
		log.info( "Admin @" + req.session.admin.username + " saved " + docs.length + " players using raw JSON" );
		res.redirect( "/admin/player/read" );
	};

	// Update/insert the player using promise:
	PlayerUtils.bulkInsert( body )
		.then( cb )
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "POST " + req.url + " Error occurred -", err );
			res.send({ message: CUSTOM_MESSAGE.ERROR });
		});
});

// Save fixture request
router.post( "/fixture", authenticate, function( req, res, next ) {
	// A fixture object contains a lot of information that will
	// modify documents present in other collections too. Ex:
	// 1. Updating the points history of home team
	// 2. Updating the points history of away team
	// 3. Updating the points history of each player on both teams

	var body = null;

	if( req.body.json ) {
		log.debug( "Admin @" + req.session.admin.username + " used raw JSON to save fixture" );
		try {
			body = JSON.parse( req.body.json );
		}
		catch( ex ) {
			log.error( "POST " + req.url + " Invalid JSON!" );
			return next();
		}
	}
	else {
		log.debug( "Admin @" + req.session.admin.username + " used form to save fixture" );
		body = req.body;
	}

	// Get some props from the body:
	var round      = body.round;
	var homeTeam   = body.home.team;
	var homeTeamId = body.home.teamId;
	var homeGoals  = TeamHelpers.getGoals( body.home.goals, body.home.penalties );
	var awayTeam   = body.away.team;
	var awayTeamId = body.away.teamId;
	var awayGoals  = TeamHelpers.getGoals( body.away.goals, body.away.penalties );

	log.debug( "Admin @" + req.session.admin.username + " " + ( body._id ? "updating" : "creating" ) + " a fixture" );

	// Form the query:
	var query = { _id: body._id };

	// The callback to be executed on saving fixture:
	var onSaveFixture = function( doc ) {
		// Update home team history:
		return updateTeamHistory( round, homeTeamId, homeTeam, homeGoals, awayGoals, true );
	};

	// The callback to be executed on updating home team history:
	var onHomeTeamHistoryUpdate = function( doc ) {
		// Update away team history:
		return updateTeamHistory( round, awayTeamId, awayTeam, awayGoals, homeGoals, false );
	};

	log.info( "Admin @" + req.session.admin.username + " started saving fixture", {
		home : homeTeam,
		away : awayTeam
	});

	// Update/insert the team using promise:
	FixtureUtils.upsert( query, body )
		.then( onSaveFixture )
		.then( onHomeTeamHistoryUpdate )
		.then( function() {
			log.info( "Admin @" + req.session.admin.username + " saved fixture successfully", {
				home : homeTeam,
				away : awayTeam
			});
			res.send({
				customCode    : CUSTOM_CODE.OK,
				customMessage : CUSTOM_MESSAGE.OK
			});
		})
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "POST " + req.url + " Error occurred -", err );
			res.send({ message: CUSTOM_MESSAGE.ERROR });
		});
});


module.exports = router;