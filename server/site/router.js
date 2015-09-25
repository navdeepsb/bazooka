// IMPORT ALL THE DEPENDENCIES
// =============================================================
var express = require( "express" );
var join    = require( "path" ).join;


// Initialize the router:
var router = express.Router();


// Define a middleware for allowing only logged-in users
// to view some pages of the website:
var authenticate = function( req, res, next ) {
	if( req.session.user ) {
		// User is logged in...
		next();
	}
	else {
		// Redirect to the login page:
		res.redirect( "/login" );
	}
};


// Declare the directory containing the static assets:
// GET /css/main.css
// assuming there's a folder named 'css' inside the 'public' dir
router.use( express.static( join( __dirname, "../../public" ) ) );


// SET WEBSITE ROUTES
// =============================================================
router.get( "/", function( req, res ) {
	res.render( "site/home", {
		title       : "Bazooka",
		titleSuffix : "",
		user        : req.session.user
	});
});

router.get( "/signup", function( req, res ) {
	res.render( "site/signup", {
		title : "Signup"
	});
});

router.get( "/login", function( req, res ) {
	res.render( "site/login", {
		title : "Login"
	});
});

router.get( "/account-created", function( req, res ) {
	res.render( "site/message", {
		title   : "Account created",
		message : "Your account has been created successfully. Please <a href='/login'>login</a> to continue..."
	});
});

router.get( "/:unm/team", authenticate, function( req, res ) {
	res.render( "site/userTeam", {
		title : "@" + req.params.unm + "'s team",
		user  : req.session.user
	});
});


module.exports = router;