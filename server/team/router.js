// IMPORT ALL THE DEPENDENCIES
// =============================================================
var express        = require( "express" );
var mongooseTypes  = require( "mongoose" ).Types;
var TeamModel      = require( "./model" );
var modelUtils     = require( "../utils/modelUtils" );
var authenticate   = require( "../middlewares/authenticateAdmin" );
var CUSTOM_CODE    = require( "../data/customCodes" );
var CUSTOM_MESSAGE = require( "../data/customMessages" );


// Initialize the router:
var router = express.Router();

// Other variables:
var TeamUtils = modelUtils( TeamModel );


// SET ROUTES
// =============================================================
router.get( "/add-team", authenticate, function( req, res, next ) {
	res.render( "team/saveTeam", {
		title : "Add Team",
		mode  : "Add",
		team  : TeamUtils.getDefaultModel()
	});
});

router.get( "/edit-team", authenticate, function( req, res, next ) {
	// Variables:
	var teamId   = req.query.id;
	var teamInfo = TeamUtils.getDefaultModel();

	if( !teamId ) {
		return next();
	}

	TeamUtils.getOne( { _id: teamId }, "-rounds" ).then( function( doc ) {
		if( !doc ) {
			// Team not found...
			return next();
		}

		// Found team...
		for( var key in doc ) {
			teamInfo[ key ] = doc[ key ];
		}

		res.render( "team/saveTeam", {
			title   : "Edit Team",
			mode    : "Edit",
			team    : teamInfo,
		});
	}).then( null, function( err ) {
		return next( err );
	});
});

router.post( "/save-team", authenticate, function( req, res, next ) {
	var body    = req.body;
	var options = { upsert: true };

	// Change the checkbox value from 'on' to boolean:
	body.inFirstDivision = body.inFirstDivision ? true : false;

	// Assign an object id to _id if it doesn't exit:
	// This is safe because the newly generated id will not match
	// any existing ids and consequently, the object will get
	// inserted/created as expected.
	if( !body._id ) {
		body._id = mongooseTypes.ObjectId();
	}

	// The callback to be called after adding or editing a team:
	var cb = function( err, team ) {
		if( err ) {
			// Unhandled error occurred, send the API response:
			res.status( status ).send({
				customCode : CUSTOM_CODE.ERROR,
				message    : CUSTOM_MESSAGE.ERROR
			});
		}
		else {
			// Success:
			res.redirect( "/admin/view-teams" );
		}
	};

	TeamModel.findOneAndUpdate( { _id: body._id }, body, options, cb );
});

router.get( "/delete-team", authenticate, function( req, res, next ) {
	// Variables to be used in the response:
	var status     = 200;
	var message    = CUSTOM_MESSAGE.UNKNOWN;
	var customCode = CUSTOM_CODE.UNKNOWN;

	if( !req.query.id ) {
		return next();
	}

	TeamModel.remove({ _id: req.query.id }, function( err, removed ) {
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

router.get( "/view-teams", authenticate, function( req, res, next ) {
	// Define the keys to be be get (space-separated):
	var selectClause = "name";

	// Now get all the teams using promise:
	TeamUtils.getAll( selectClause ).then( function( docs ) {
		res.render( "team/teamList", {
			title : "All Teams",
			teams : docs
		});
	}).then( null, function( err ) {
		return next( err );
	});
});


module.exports = router;