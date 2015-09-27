// IMPORT ALL THE DEPENDENCIES
// =============================================================
var express        = require( "express" );
var mongooseTypes  = require( "mongoose" ).Types;
var AdminModel     = require( "./model" );
var TeamModel      = require( "../team/model" );
var authenticate   = require( "../middlewares/authenticate" );
var CUSTOM_CODE    = require( "../data/customCodes" );
var CUSTOM_MESSAGE = require( "../data/customMessages" );


// Initialize the router:
var router = express.Router();


// SET ROUTES
// =============================================================
router.get( "/login", function( req, res, next ) {
	res.render( "admin/login", {
		title : "Admin Login"
	});
});

router.post( "/login", function( req, res, next ) {
	// Get the values from the request body:
	var username = req.body.username;
	var password = req.body.password;

	var query = AdminModel.findOne({ username: username, password: password });

	query.exec( function( err, user ) {
		if( err ) {
			return next( err );
		}

		if( user ) {
			// Set the user info in the session:
			user.password    = undefined;
			req.session.user = user;

			res.redirect( "/admin/panel" );
		}
		else {
			// Invalid credentials
			res.send({ message: CUSTOM_MESSAGE.INVALID_CREDENTIALS });
		}
	});
});

router.get( "/panel", authenticate, function( req, res, next ) {
	res.render( "admin/panel", {
		title : "Admin Panel"
	});
});

router.get( "/save-team", authenticate, function( req, res, next ) {
	// Variables:
	var teamId   = req.query.id;
	var mode     = teamId ? "Edit" : "Add";
	var message  = "";
	var teamInfo = {
		_id     : "",
		name    : "",
		abbr    : "",
		crest   : "",
		stadium : "",
		city    : "",
		country : "",
		inFirstDivision: true
	};

	if( teamId ) {
		// Saving a team...

		// Make a query to get the requested team:
		var query = TeamModel.findOne({ _id: teamId }).select( "-rounds" );

		// Fire the query:
		query.exec( function( err, team ) {
			if( err ) {
				return next( err );
			}

			if( team ) {
				// Found team...
				for( var key in teamInfo ) {
					teamInfo[ key ] = team[ key ];
				}
			}
			else {
				// Team not found...
				mode    = "Add";
				message = "The team having _id " + teamId + " doesn't exist!";
			}

			res.render( "admin/saveTeam", {
				title   : "Save Team",
				mode    : mode,
				team    : teamInfo,
				message : message
			});
		});
	}
	else {
		// Adding new team...
		res.render( "admin/saveTeam", {
			title   : "Save Team",
			mode    : mode,
			team    : teamInfo,
			message : message
		});
	}
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
	// Make a blank search to get all teams:
	var query = TeamModel.find({});

	// Get only the name:
	query.select( "name" );

	// Fire the query:
	query.exec( function( err, teams ) {
		if( err ) {
			return next( err );
		}

		res.render( "admin/teamList", {
			title : "All Teams",
			teams : teams || []
		});
	});
});


module.exports = router;