// IMPORT ALL THE DEPENDENCIES
// =============================================================
var router         = require( "express" ).Router();
var log            = require( "bole" )( "userAPIRouter" );
var UserModel      = require( "./model" );
var authenticate   = require( "../middlewares/authenticateUser" );
var modelUtils     = require( "../utils/modelUtils" );
var CUSTOM_CODE    = require( "../data/customCodes" );
var CUSTOM_MESSAGE = require( "../data/customMessages" );


// Define the model utils:
var UserUtils  = modelUtils( UserModel );


// API routes
// =============================================================

// User signup request
router.post( "/signup", function( req, res, next ) {
	log.debug( "User signup initiated" );

	// Create a new instance of the User model:
	var userModel = new UserModel( req.body );

	// Save the user and check for errors:
	userModel.save( function( err, user ) {
		// Variables to be used in the API response:
		var status     = 200;
		var message    = CUSTOM_MESSAGE.UNKNOWN;
		var customCode = CUSTOM_CODE.UNKNOWN;

		if( err ) {
			// Check for duplicate key error:
			if( err.code === 11000 ) {
				if( err.errmsg.indexOf( "$username" ) > 0 ) {
					message    = CUSTOM_MESSAGE.USERNAME_UNAVAILABLE;
					customCode = CUSTOM_CODE.USERNAME_UNAVAILABLE;
					log.warn( "POST " + req.url + " Duplicate username @" + req.body.username + ", email addr - " + req.body.email );
				}
				else if( err.errmsg.indexOf( "$email" ) > 0 ) {
					message    = CUSTOM_MESSAGE.EMAIL_UNAVAILABLE;
					customCode = CUSTOM_CODE.EMAIL_UNAVAILABLE;
					log.warn( "POST " + req.url + " Duplicate email '" + req.body.email + "', username - @" + req.body.username );
				}
			}
			else {
				// Unhandled error occurred:
				status     = 500;
				message    = CUSTOM_MESSAGE.ERROR;
				customCode = CUSTOM_CODE.ERROR;
				log.error( "POST " + req.url + " Error occurred -", err );
			}
		}
		else {
			// Success:
			message    = CUSTOM_MESSAGE.OK;
			customCode = CUSTOM_CODE.OK;
			log.info( "User @" + user.username + " signup successful" );
			log.debug( "User signup finished" );
		}

		// Send the API response:
		res.status( status ).send({ customCode: customCode, message: message });
	});
});

// User login request
router.post( "/login", function( req, res, next ) {
	log.debug( "User @" + req.body.username + " attempting to login" );

	// Variables to be used in the API response:
	var message    = CUSTOM_MESSAGE.UNKNOWN;
	var customCode = CUSTOM_CODE.UNKNOWN;

	// Form the query:
	var query = { username: req.body.username, password: req.body.password };

	// Select the keys to retrieve:
	var select = "-password";

	// The callback to be executed on promise getting resolved:
	var cb = function( doc ) {
		if( doc ) {
			if( doc.isActivated ) {
				// Valid credentials and activated user
				message    = CUSTOM_MESSAGE.OK;
				customCode = CUSTOM_CODE.OK;

				// Set the user info in the session:
				req.session.user = doc;

				log.info( "User @" + doc.username + " login successful" );
			}
			else {
				// Valid credentials and unactivated user
				message    = CUSTOM_MESSAGE.ACCOUNT_UNACTIVATED;
				customCode = CUSTOM_CODE.ACCOUNT_UNACTIVATED;
				log.info( "User @" + doc.username + " is not activated" );
			}
		}
		else {
			// Invalid credentials
			message    = CUSTOM_MESSAGE.INVALID_CREDENTIALS;
			customCode = CUSTOM_CODE.INVALID_CREDENTIALS;
			log.info( "User @" + req.body.username + " sent invalid credentials" );
		}

		// Send the API response:
		res.send({ customCode: customCode, message: message });
	};

	// Find the user:
	UserUtils.getOne( query, select )
		.then( cb )
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "POST " + req.url + " Error occurred -", err );
			res.status( 500 ).send({
				customCode : CUSTOM_CODE.ERROR,
				message    : CUSTOM_MESSAGE.ERROR
			});
		});
});


module.exports = router;