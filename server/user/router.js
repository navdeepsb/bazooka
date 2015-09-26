// IMPORT ALL THE DEPENDENCIES
// =============================================================
var router         = require( "express" ).Router();
var log            = require( "bole" )( "user-router" );
var UserModel      = require( "./model" );
var CUSTOM_CODE    = require( "../data/customCodes" );
var CUSTOM_MESSAGE = require( "../data/customMessages" );


// API routes
// =============================================================
router.post( "/signup", function( req, res, next ) {

	log.debug( req.url + " Saving user..." );

	// Create a new instance of the User model:
	var userModel = new UserModel( req.body );

	// Save the user and check for errors:
	userModel.save( function( err, user ) {
		// Variables to be used in the API response:
		var status     = 200;
		var message    = CUSTOM_MESSAGE.UNKNOWN;
		var customCode = CUSTOM_CODE.UNKNOWN;

		if( err ) {
			log.error( req.url + " " + err.errmsg );

			// Check for duplicate key error:
			if( err.code === 11000 ) {
				// Set the status as successful because we know about the error:
				status = 200;

				if( err.errmsg.indexOf( "$username" ) > 0 ) {
					message    = CUSTOM_MESSAGE.USERNAME_UNAVAILABLE;
					customCode = CUSTOM_CODE.USERNAME_UNAVAILABLE;
				}
				else if( err.errmsg.indexOf( "$email" ) > 0 ) {
					message    = CUSTOM_MESSAGE.EMAIL_UNAVAILABLE;
					customCode = CUSTOM_CODE.EMAIL_UNAVAILABLE;
				}
			}
			else {
				// Unhandled error occurred:
				status     = 500;
				message    = CUSTOM_MESSAGE.ERROR;
				customCode = CUSTOM_CODE.ERROR;
			}
		}
		else {
			// Success:
			status     = 200;
			message    = CUSTOM_MESSAGE.OK;
			customCode = CUSTOM_CODE.OK;
			log.info( req.url + " User saved - @" + user.username );
		}

		// Send the API response:
		res.status( status ).send({ customCode: customCode, message: message });
	});
});

router.post( "/login", function( req, res, next ) {

	// Variables to be used in the API response:
	var status     = 200;
	var message    = CUSTOM_MESSAGE.UNKNOWN;
	var customCode = CUSTOM_CODE.UNKNOWN;

	// Get the values from the request body:
	var username = req.body.username;
	var password = req.body.password;

	log.debug( req.url + " @" + username + " logging in" );

	var query = UserModel.findOne({ username: username, password: password });

	query.exec( function( err, user ) {
		if( err ) {
			log.error( req.url + " " + err.errmsg );

			// Error occurred:
			status     = 500;
			message    = CUSTOM_MESSAGE.ERROR;
			customCode = CUSTOM_CODE.ERROR;

			return next( err );
		}

		if( user ) {
			if( user.isActivated ) {
				// Valid credentials and activated user
				status     = 200;
				message    = CUSTOM_MESSAGE.OK;
				customCode = CUSTOM_CODE.OK;

				// Set the user info in the session:
				user.password    = undefined;
				req.session.user = user;

				log.info( req.url + " @" + username + " login successful" );
			}
			else {
				// Valid credentials and unactivated user
				status     = 200;
				message    = CUSTOM_MESSAGE.ACCOUNT_UNACTIVATED;
				customCode = CUSTOM_CODE.ACCOUNT_UNACTIVATED;
				log.info( req.url + " @" + username + " is not activated" );
			}
		}
		else {
			// Invalid credentials
			status     = 200;
			message    = CUSTOM_MESSAGE.INVALID_CREDENTIALS;
			customCode = CUSTOM_CODE.INVALID_CREDENTIALS;
			log.info( req.url + " @" + username + " sent invalid credentials" );
		}

		// Send the API response:
		res.status( status ).send({ customCode: customCode, message: message });
	});
});


module.exports = router;