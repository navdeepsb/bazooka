// IMPORT ALL THE DEPENDENCIES
// =============================================================
var _                = require( "lodash" );
var router           = require( "express" ).Router();
var log              = require( "bole" )( "teamAPIRouter" );
var TeamModel        = require( "./model" );
var TeamHistoryModel = require( "./historyModel" );
var modelUtils       = require( "../utils/modelUtils" );
var POINTS           = require( "../data/fixturePoints" );
var CUSTOM_CODE      = require( "../data/customCodes" );
var CUSTOM_MESSAGE   = require( "../data/customMessages" );


// Variables:
var TeamUtils        = modelUtils( TeamModel );
var TeamHistoryUtils = modelUtils( TeamHistoryModel );


// SET ROUTES
// =============================================================

// GET /api/teams Returns all teams in first division
router.get( "/teams", function( req, res, next ) {
	// Form the query:
	var query = { inFirstDivision: true };

	// Select the keys to retrieve:
	var select = "name";

	if( req.query.select ) {
		// Ex. "name,stadium,city" => "name stadium city"
		select = req.query.select.replace( new RegExp( ",", "g" ), " " );
	}

	// The callback to be executed on promise getting resolved:
	var cb = function( docs ) {
		res.send({
			teams         : docs,
			customCode    : CUSTOM_CODE.OK,
			customMessage : CUSTOM_MESSAGE.OK
		});
	};

	// Now get all the teams using promise:
	TeamUtils.getAll( query, select )
		.then( cb )
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "GET " + req.url + " Error occurred -", err );
			res.status( 500 ).send({
				status        : 500,
				teams         : [],
				customCode    : CUSTOM_CODE.ERROR,
				customMessage : CUSTOM_MESSAGE.ERROR
			});
		});
});

// GET /api/teamstats/:round Returns all the teams' history
// NOTE:
// The current round's as well as the previous round's history
// objects shall be returned so the current round points can
// be calculated. This is so because we are saving cumulative
// points in the history objects.
router.get( "/teamstats/:round", function( req, res, next ) {
	var round = req.params.round;

	// For the query:
	var query = { "history.round": { $in: [ round, round - 1 ] } };

	// The callback to be executed on promise getting resolved:
	var cb = function( docs ) {
		// `docs` schema:
		// [{ team: "", history: [{ round: 1, ...}, { round: 2, ...}] }, ...]
		// This shall be converted into the following format:
		// [{ team: "", rounds: { 1: {...}, 2: {...} }, history: [{}] } ...]
		// i.e. `history` indexed by the `round`

		var stats = _.chain( docs )
			.map( function( doc ) {
				// Index the history by rounds:
				doc.rounds = _.indexBy( doc.history, "round" );

				// Remove the redundant history array:
				doc.history = [{}];

				return doc;
			})
			.sortBy( function( doc ) {
				return -1 * (
					( doc.rounds[ round ].cumWins  * POINTS.WIN  ) +
					( doc.rounds[ round ].cumDraws * POINTS.DRAW ) +
					( doc.rounds[ round ].cumScored   ) -
					( doc.rounds[ round ].cumConceded )
				);
			});

		res.send({
			stats         : stats,
			customCode    : CUSTOM_CODE.OK,
			customMessage : CUSTOM_MESSAGE.OK
		});
	};

	// Now get the history using promise:
	TeamHistoryUtils.getAll( query )
		.then( cb )
		.then( null, function( err ) {
			// Error occurred, promise rejected...
			log.error( "GET " + req.url + " Error occurred -", err );
			res.status( 500 ).send({
				status        : 500,
				stats         : [],
				customCode    : CUSTOM_CODE.ERROR,
				customMessage : CUSTOM_MESSAGE.ERROR
			});
		});
});


module.exports = router;