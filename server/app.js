// IMPORT ALL THE DEPENDENCIES
// =============================================================
var express    = require( "express" );
var session    = require( "express-session" );
var bodyParser = require( "body-parser" );
var config     = require( "./config" );
var siteRouter = require( "./site/router" );
var userRouter = require( "./user/router" );
var error404   = require( "./errors/404" );
var error500   = require( "./errors/500" );


// Initialize express for our app:
var app = express();

// Other variables:
var env = app.get( "env" );

// Set the view variables:
app.locals.appName     = config.app.name;
app.locals.leagueName  = config.app.league;
app.locals.titleSuffix = " | " + config.app.name;


// Set the app templating system:
app.set( "views", __dirname );
app.set( "view engine", "jade" );


// Set the session middleware:
// This also populates the `req.session` hash
app.use( session({
	resave: false,
	saveUninitialized: false,
	secret: "TextLeftDangling"
}));


// Set another middleware that will prevent the browser
// back button problem. This will force the browser to
// reload the page upon navigating back:
// http://stackoverflow.com/questions/6096492/node-js-and-express-session-handling-back-button-problem
app.use( function( req, res, next ) {
	res.header( "Cache-Control", "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0" );
	next();
});


// Set the app middleware:
// Configure app to use bodyParser()
// This will let us get the data from a POST
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );


// Set the routes:
app.use( siteRouter );
app.use( "/user", userRouter );


// Finally, set the error handlers:
app.use( error404 );
app.use( error500 );


module.exports = app;