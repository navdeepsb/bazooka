// IMPORT ALL THE DEPENDENCIES
// =============================================================
var express             = require( "express" );
var join                = require( "path" ).join;
var config              = require( "../config" );
var validateRound       = require( "../middlewares/validateRound" );
var preventLoggedInUser = require( "../middlewares/preventLoggedInUser" );

// Initialize the router:
var router = express.Router();


// Declare the directory containing the static assets:
// GET /css/main.css
// assuming there's a folder named 'css' inside the 'public' dir
router.use( express.static( join( __dirname, "../../public" ) ) );


// SET WEBSITE ROUTES
// =============================================================

// Home page
router.get( "/", function( req, res, next ) {
	res.render( "site/home", {
		title       : config.app.name,
		titleSuffix : "",
		user        : req.session.user
	});
});

// Signup page
router.get( "/signup", preventLoggedInUser, function( req, res, next ) {
	res.render( "site/signup", {
		title : "Signup"
	});
});

// Login page
router.get( "/login", preventLoggedInUser, function( req, res, next ) {
	res.render( "site/login", {
		title : "Login"
	});
});

// Acct. created page
router.get( "/account-created", preventLoggedInUser, function( req, res, next ) {
	res.render( "site/accountCreated", {
		title : "Account created"
	});
});

// Fixture listing page
router.get( "/fixtures", function( req, res, next ) {
	res.render( "site/fixtures", {
		title : config.app.league + " Fixtures"
	});
});

// Standings page
router.get( "/standings", function( req, res, next ) {
	res.render( "site/standings", {
		title : config.app.league + " Standings"
	});
});


module.exports = router;