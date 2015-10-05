// IMPORT ALL THE DEPENDENCIES
// =============================================================
var router         = require( "express" ).Router();
var log            = require( "bole" )( "userRouter" );
var UserModel      = require( "./model" );
var authenticate   = require( "../middlewares/authenticateUser" );
var modelUtils     = require( "../utils/modelUtils" );


// Define the model utils:
var UserUtils  = modelUtils( UserModel );


// API routes
// =============================================================

// User logout
router.get( "/user/logout", function( req, res, next ) {
	if( req.session.user ) {
		log.info( "User @" + req.session.user.username + " logged out" );
		req.session.destroy();
		res.redirect( "/" );
	}
	else {
		next();
	}
});

// User team page
router.get( "/:unm/team", function( req, res, next ) {
	// Form the query:
	var query = { username: req.params.unm };

	// Select the keys to retrieve:
	var select = "-password";

	// The callback to be executed on promise getting resolved:
	var cb = function( doc ) {
		if( doc ) {
			// User exists
			res.render( "user/userTeam", {
				title      : "@" + req.params.unm + "'s team",
				user       : doc,
				isLoggedIn : req.session.user ? true : false
			});
		}
		else {
			// User not found
			next();
		}
	};

	// Find the user:
	UserUtils.getOne( query, select )
		.then( cb )
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "POST " + req.url + " Error occurred -", err );
			throw new Error( err );
		});
});


module.exports = router;