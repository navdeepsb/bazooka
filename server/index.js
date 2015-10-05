// IMPORT ALL THE DEPENDENCIES
// =============================================================
var mongoose    = require( "mongoose" );
var bole        = require( "bole" );
var boleConsole = require( "bole-console" );
var config      = require( "./config" );
var app         = require( "./app" );


// Nifty variables:
var port  = process.env.EXPRESS_PORT || config.server.port;
var dbUri = config.db.uri;
var log   = bole( "server" );


// SET UP LOGGING
// =============================================================
bole.output({
	level  : config.server.logLevel,
	stream : boleConsole({
		colors         : true,
		timestamp      : true,
		requestDetails : true
	})
});


// HANDLE UNCAUGHT EXCEPTIONS
// =============================================================
process.on( "uncaughtException", function( err ) {
	log.error( err );
});


// CONNECT TO MONGO
// =============================================================
mongoose.connect( dbUri, function( err ) {
	if( err ) {
		log.error( "Couldn't connect to Mongo, " + dbUri + ", exiting..." );
		process.exit( 0 ); // 0 = Success, 1 = Error
	}

	// Log successful db connection:
	log.info( "Mongo connected on " + dbUri );

	// START THE SERVER
	// =========================================================
	app.listen( port, function() {
		log.info( "Server started on port " + port + "..." );
	});
});