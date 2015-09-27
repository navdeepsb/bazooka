// IMPORT ALL THE DEPENDENCIES
// =============================================================
var express      = require( "express" );
var join         = require( "path" ).join;
var config       = require( "../config" );

// Initialize the router:
var router = express.Router();

// Other variables:
var maxRounds = 2 * ( ( config.app.teams || 20 ) - 1 );


// Declare the directory containing the static assets:
// GET /css/main.css
// assuming there's a folder named 'css' inside the 'public' dir
router.use( express.static( join( __dirname, "../../public" ) ) );


// SET WEBSITE ROUTES
// =============================================================
router.get( "/", function( req, res ) {
	res.render( "site/home", {
		title       : config.app.name,
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

router.get( "/matches/:round", function( req, res, next ) {
	var currRound = req.params.round;

	if( currRound < 1 || currRound > maxRounds ) {
		next();
	}
	else {
		res.render( "site/matches", {
			title : config.app.league + " Matches",
			round : currRound
		});
	}
});


module.exports = router;