// IMPORT ALL THE DEPENDENCIES
// =============================================================
var router          = require( "express" ).Router();
var log             = require( "bole" )( "adminRouter" );
var _               = require( "lodash" );
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

// Admin login page
router.get( "/login", function( req, res, next ) {
	res.render( "admin/login", {
		title : "Admin Login"
	});
});

// Admin logout
router.get( "/logout", function( req, res, next ) {
	if( req.session.admin ) {
		log.info( "Admin @" + req.session.admin.username + " logged out" );
		req.session.destroy();
		res.redirect( "/admin/login" );
	}
	else {
		next();
	}
});

// Admin panel
router.get( "/panel", authenticate, function( req, res, next ) {
	res.render( "admin/panel", {
		title : "Admin Panel"
	});
});

// Creating a team
router.get( "/team/create", authenticate, function( req, res, next ) {
	res.render( "admin/saveTeam", {
		title : "Create Team",
		mode  : "Create",
		team  : TeamUtils.getDefaultModel()
	});
});

// Viewing teams
router.get( "/team/read", authenticate, function( req, res, next ) {
	// Form the query:
	var query = {};

	// Select the keys to retrieve:
	var select = "name";

	// The callback to be executed on promise getting resolved:
	var cb = function( docs ) {
		res.render( "admin/viewTeams", {
			title : "Read Teams",
			teams : docs
		});
	};

	// Now get all the teams using promise:
	TeamUtils.getAll( query, select )
		.then( cb )
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "GET " + req.url + " Error occurred -", err );
			res.send({ message: CUSTOM_MESSAGE.ERROR });
		});
});

// Updating a team
router.get( "/team/update", authenticate, function( req, res, next ) {
	// Get the id from the query params:
	var id = req.query.id;

	// Don't proceed further for an empty id:
	if( !id ) {
		return next();
	}

	// Other variables:
	var defTeam = TeamUtils.getDefaultModel();

	// Form the query:
	var query = { _id: id };

	// Select the keys to retrieve:
	var select = "-rounds";

	// The callback to be executed on promise getting resolved:
	var cb = function( doc ) {
		if( !doc ) {
			// Not found
			return next();
		}

		for( var key in doc ) {
			defTeam[ key ] = doc[ key ];
		}

		res.render( "admin/saveTeam", {
			title : "Update Team",
			mode  : "Update",
			team  : defTeam
		});
	};

	// Proceed with the promise:
	TeamUtils.getOne( query, select )
		.then( cb )
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "GET " + req.url + " Error occurred -", err );
			res.send({ message: CUSTOM_MESSAGE.ERROR });
		});
});

// Deleting a team
router.get( "/team/delete", authenticate, function( req, res, next ) {
	// Get the id from the query params:
	var id = req.query.id;

	// Don't proceed further for an empty id:
	if( !id ) {
		return next();
	}

	// Form the query:
	var query = { _id: id };

	// Select the keys to retrieve:
	var select = "name";

	// The callback to be executed on promise getting resolved:
	var cb = function( doc ) {
		if( !doc ) {
			// Not found
			return next();
		}

		// Now remove it:
		doc.remove();

		// Success
		res.send({ message: CUSTOM_MESSAGE.OK });

		log.info( "@" + req.session.admin.username + " deleted team", {
			_id  : id,
			name : doc.name
		});
	};

	// Now find the team using promise:
	TeamUtils.getOne( query, select )
		.then( cb )
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "GET " + req.url + " Error occurred -", err );
			res.send({ message: CUSTOM_MESSAGE.ERROR });
		});
});

// Creating a player
router.get( "/player/create", authenticate, function( req, res, next ) {
	// Form the query:
	var query = {};

	// Select the keys to retrieve:
	var select = "name";

	// The callback to be executed on promise getting resolved:
	var cb = function( docs ) {
		res.render( "admin/savePlayer", {
			title     : "Create Player",
			mode      : "Create",
			player    : PlayerUtils.getDefaultModel(),
			allTeams  : docs,
			allStatus : VALID_STATUS,
			allPos    : VALID_POSITIONS
		});
	};

	// Find the document now:
	TeamUtils.getAll( query, select )
		.then( cb )
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "GET " + req.url + " Error occurred -", err );
			res.send({ message: CUSTOM_MESSAGE.ERROR });
		});
});

// Viewing players
router.get( "/player/read", authenticate, function( req, res, next ) {
	// Form the query:
	var query = {};

	// Select the keys to retrieve:
	var select = "name team jerseyNum position status";

	// The callback to be executed on promise getting resolved:
	var cb = function( docs ) {
		res.render( "admin/viewPlayers", {
			title     : "Read Players",
			players   : docs,
			allTeams  : _.uniq( _.pluck( docs, "team" ) ),
			allStatus : VALID_STATUS,
			allPos    : VALID_POSITIONS
		});
	};

	// Now get all the players using promise:
	PlayerUtils.getAll( query, select )
		.then( cb )
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "GET " + req.url + " Error occurred -", err );
			res.send({ message: CUSTOM_MESSAGE.ERROR });
		});
});

// Updating a player
router.get( "/player/update", authenticate, function( req, res, next ) {
	// NOTE:
	// This request is processed in two steps:
	// 1. All the teams are get ( similar to /player/create )
	// 2. The requested player's info is gotten

	// Get the id from the query params:
	var id = req.query.id;

	// Don't proceed further for an empty id:
	if( !id ) {
		return next();
	}

	// Other variables:
	var allTeams  = [];
	var defPlayer = PlayerUtils.getDefaultModel();

	// Form the queries:
	var teamQuery   = {};
	var playerQuery = { _id: id };

	// And the keys to select:
	var teamSelect   = "name";
	var playerSelect = "-pointsHistory";

	// Callbacks for resolved promises:
	var teamCb   = function( docs ) {
		allTeams = docs;
		// Return the promise for chaining:
		return PlayerUtils.getOne( playerQuery, playerSelect );
	};
	var playerCb = function( doc ) {
		if( !doc ) {
			// Not found
			return next();
		}

		for( var key in doc ) {
			defPlayer[ key ] = doc[ key ];
		}

		res.render( "admin/savePlayer", {
			title     : "Update Player",
			mode      : "Update",
			player    : defPlayer,
			allTeams  : allTeams,
			allStatus : VALID_STATUS,
			allPos    : VALID_POSITIONS
		});
	};

	// Proceed with the promise:
	TeamUtils.getAll( teamQuery, teamSelect )
		.then( teamCb )
		.then( playerCb )
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "GET " + req.url + " Error occurred -", err );
			res.send({ message: CUSTOM_MESSAGE.ERROR });
		});
});

// Deleting a player
router.get( "/player/delete", authenticate, function( req, res, next ) {
	// Get the id from the query params:
	var id = req.query.id;

	// Don't proceed further for an empty id:
	if( !id ) {
		return next();
	}

	// Form the query:
	var query = { _id: id };

	// Select the keys to retrieve:
	var select = "name";

	// The callback to be executed on promise getting resolved:
	var cb = function( removed ) {
		if( !doc ) {
			// Not found
			return next();
		}

		// Now remove it:
		doc.remove();

		// Success
		res.send({ message: CUSTOM_MESSAGE.OK });

		log.info( "@" + req.session.admin.username + " deleted player", {
			_id  : id,
			name : doc.name
		});
	};

	// Now delete the player using promise:
	PlayerUtils.delete( query )
		.then( cb )
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "GET " + req.url + " Error occurred -", err );
			res.send({ message: CUSTOM_MESSAGE.ERROR });
		});
});


module.exports = router;