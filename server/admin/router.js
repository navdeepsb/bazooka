// IMPORT ALL THE DEPENDENCIES
// =============================================================
var express        = require( "express" );
var AdminModel     = require( "./model" );
var TeamModel      = require( "../team/model" );
var authenticate   = require( "../middlewares/authenticate" );
var CUSTOM_CODE    = require( "../data/customCodes" );
var CUSTOM_MESSAGE = require( "../data/customMessages" );


// Initialize the router:
var router = express.Router();


// SET ROUTES
// =============================================================
router.get( "/login", function( req, res ) {
	res.render( "admin/login", {
		title : "Admin Login"
	});
});

router.post( "/login", function( req, res ) {

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

router.get( "/panel", authenticate, function( req, res ) {
	res.render( "admin/panel", {
		title : "Admin Panel"
	});
});

router.get( "/save-team", authenticate, function( req, res ) {
	res.render( "admin/saveTeam", {
		title : "Save Team",
		mode  : req.query.id ? "Edit" : "Add",
		team  : {
			name    : "",
			abbr    : "",
			crest   : "",
			stadium : "",
			city    : "",
			country : "",
			inFirstDivision: true
		}
	});
});

router.post( "/save-team", authenticate, function( req, res, next ) {

	var body = req.body;

	// Change the checkbox value from 'on' to boolean:
	body.inFirstDivision = body.inFirstDivision ? true : false;

	// Create a new instance of the Team model:
	var teamModel = new TeamModel( body );

	// Save the user and check for errors:
	teamModel.save( function( err, user ) {
		// Variables to be used in the API response:
		var status     = 200;
		var message    = CUSTOM_MESSAGE.UNKNOWN;
		var customCode = CUSTOM_CODE.UNKNOWN;

		if( err ) {
			// Unhandled error occurred:
			status     = 500;
			message    = CUSTOM_MESSAGE.ERROR;
			customCode = CUSTOM_CODE.ERROR;
		}
		else {
			// Success:
			status     = 200;
			message    = CUSTOM_MESSAGE.OK;
			customCode = CUSTOM_CODE.OK;
		}

		// Send the API response:
		res.status( status ).send({ customCode: customCode, message: message });
	});
});

router.get( "/view-teams", authenticate, function( req, res, next ) {

	// Make a blank search to get all teams:
	var query = TeamModel.find({});

	// Get only name and id:
	query.select( "name _id" );

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