// IMPORT ALL THE DEPENDENCIES
// =============================================================
var express         = require( "express" );
var mongooseTypes   = require( "mongoose" ).Types;
var PlayerModel     = require( "./model" );
var TeamModel       = require( "../team/model" );
var modelUtils      = require( "../utils/modelUtils" );
var authenticate    = require( "../middlewares/authenticateAdmin" );
var CUSTOM_CODE     = require( "../data/customCodes" );
var CUSTOM_MESSAGE  = require( "../data/customMessages" );
var VALID_POSITIONS = require( "../data/playingPositions" );
var VALID_STATUS    = require( "../data/playerStatus" );


// Initialize the router:
var router = express.Router();

// Other variables:
var PlayerUtils = modelUtils( PlayerModel );
var TeamUtils   = modelUtils( TeamModel );


// SET ROUTES
// =============================================================
router.get( "/add-player", authenticate, function( req, res, next ) {
	TeamUtils.getAll( "name" ).then( function( docs ) {
		res.render( "player/savePlayer", {
			title     : "Add Player",
			mode      : "Add",
			player    : PlayerUtils.getDefaultModel(),
			allTeams  : docs,
			allStatus : VALID_STATUS,
			allPos    : VALID_POSITIONS
		});
	}).then( null, function( err ) {
		return next( err );
	});
});

router.get( "/edit-player", authenticate, function( req, res, next ) {
	// Variables:
	var playerId   = req.query.id;
	var playerInfo = PlayerUtils.getDefaultModel();
	var allTeams   = [];

	if( !playerId ) {
		return next();
	}

	TeamUtils.getAll( "name" ).then( function( docs ) {
		allTeams = docs;
		return PlayerUtils.getOne( { _id: playerId }, "-pointsHistory" );
	}).then( function( player ) {
		if( !player ) {
			// Player not found...
			return next();
		}

		// Found player...
		for( var key in player ) {
			playerInfo[ key ] = player[ key ];
		}

		res.render( "player/savePlayer", {
			title     : "Edit Player",
			mode      : "Edit",
			player    : playerInfo,
			allTeams  : allTeams,
			allStatus : VALID_STATUS,
			allPos    : VALID_POSITIONS
		});
	}).then( null, function( err ) {
		return next( err );
	});
});

router.post( "/save-player", authenticate, function( req, res, next ) {
	var body    = req.body;
	var options = { upsert: true };

	// Assign an object id to _id if it doesn't exit:
	// This is safe because the newly generated id will not match
	// any existing ids and consequently, the object will get
	// inserted/created as expected.
	if( !body._id ) {
		body._id = mongooseTypes.ObjectId();
	}

	// The callback to be called after adding or editing a player:
	var cb = function( err, player ) {
		if( err ) {
			// Unhandled error occurred, send the API response:
			res.status( status ).send({
				customCode : CUSTOM_CODE.ERROR,
				message    : CUSTOM_MESSAGE.ERROR
			});
		}
		else {
			// Success:
			res.redirect( "/admin/view-players" );
		}
	};

	PlayerModel.findOneAndUpdate( { _id: body._id }, body, options, cb );
});

router.get( "/delete-player", authenticate, function( req, res, next ) {
	// Variables to be used in the response:
	var status     = 200;
	var message    = CUSTOM_MESSAGE.UNKNOWN;
	var customCode = CUSTOM_CODE.UNKNOWN;

	if( !req.query.id ) {
		return next();
	}

	PlayerModel.remove({ _id: req.query.id }, function( err, removed ) {
		if( err ) {
			// Unhandled error occurred:
			status     = 500;
			message    = CUSTOM_MESSAGE.ERROR;
			customCode = CUSTOM_CODE.ERROR;
			return next( err );
		}

		if( removed.result.n ) {
			// Success:
			status     = 200;
			message    = CUSTOM_MESSAGE.OK;
			customCode = CUSTOM_CODE.OK;
		}
		else {
			// Not found:
			status     = 200;
			message    = CUSTOM_MESSAGE.NOT_FOUND;
			customCode = CUSTOM_CODE.NOT_FOUND;
		}

		// Send the API response:
		res.status( status ).send({ customCode: customCode, message: message });
	});
});

router.get( "/view-players", authenticate, function( req, res, next ) {
	// Define the keys to be be get (space-separated):
	var selectClause = "name team jerseyNum position";

	// Now get all the players using promise:
	PlayerUtils.getAll( selectClause ).then( function( docs ) {
		res.render( "player/playerList", {
			title   : "All Players",
			players : docs
		});
	}).then( null, function( err ) {
		return next( err );
	});
});


module.exports = router;