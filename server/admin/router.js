// IMPORT ALL THE DEPENDENCIES
// =============================================================
var express      = require( "express" );
var AdminModel   = require( "./model" );
var authenticate = require( "../middlewares/authenticate" );


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


module.exports = router;