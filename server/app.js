// IMPORT ALL THE DEPENDENCIES
// =============================================================
var express    = require( "express" );
var bodyParser = require( "body-parser" );
var siteRouter = require( "./site/router" );
var userRouter = require( "./user/router" );
var error404   = require( "./errors/404" );
var error500   = require( "./errors/500" );


// Initialize express for our app:
var app = express();

// Other variables:
var env = app.get( "env" );

// Set the view variables:
app.locals.titleSuffix = " | Bazooka";


// Set the app templating system:
app.set( "views", __dirname );
app.set( "view engine", "jade" );


// Set the app middleware:
// Configure app to use bodyParser()
// This will let us get the data from a POST
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );


// Set the routes:
app.use( siteRouter );
app.use( "/api/user", userRouter );


// Finally, set the error handlers:
app.use( error404 );
app.use( error500 );


module.exports = app;