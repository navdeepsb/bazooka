// IMPORT ALL THE DEPENDENCIES
// =============================================================
var express = require( "express" );
var join    = require( "path" ).join;


// Initialize the router:
var router = express.Router();


// Declare the directory containing the static assets:
// GET /css/main.css
// assuming there's a folder named 'css' inside the 'public' dir
router.use( express.static( join( __dirname, "../../public" ) ) );


// SET WEBSITE ROUTES
// =============================================================
router.get( "/", function( req, res ) {
	res.render( "site/home", {
		title: "Bazooka",
		titleSuffix: ""
	});
});

router.get( "/signup", function( req, res ) {
	res.render( "site/signup", {
		title: "Signup"
	});
});

router.get( "/login", function( req, res ) {
	res.render( "site/login", {
		title: "Login"
	});
});

router.get( "/account-created", function( req, res ) {
	res.render( "site/message", {
		title: "Account created",
		message: "Your account has been created successfully. Please <a href='/login'>login</a> to continue..."
	});
});


module.exports = router;