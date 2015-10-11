// IMPORT ALL THE DEPENDENCIES
// =============================================================
var _                = require( "lodash" );
var log              = require( "bole" )( "updateTeamHistory" );
var TeamHistoryModel = require( "../team/historyModel" );
var TeamHelpers      = require( "../team/utils" );
var modelUtils       = require( "../utils/modelUtils" );


// Variables:
var TeamHistoryUtils = modelUtils( TeamHistoryModel );


// The main function
// NOTE: Returns a promise that needs to be resolved
module.exports = function( round, teamId, teamName, goalsScored, goalsConcdd, wasHomeGame ) {
	log.debug( "Team history update started", { round: round, team: teamName } );

	return TeamHistoryUtils.getOne( { team: teamName } )
		.then( function( doc ) {
			// `doc` will be the team history object -
			// { team: "Real Madrid", history: [...] }

			if( !doc ) {
				log.debug( "No previous team history found", { round: round, team: teamName } );
				// Not present, insert it and return the promise:
				return TeamHistoryUtils.upsert( {}, { teamId: teamId, team: teamName } );
			}
			else {
				log.debug( "Team history found", { round: round, team: teamName } );
			}

			// Return the `doc` as it is found in the getOne() call:
			return doc;
		})
		.then( function( doc ) {
			// `doc.history` array -
			// [ { round: 1, data: ... }, { round: 2, data: ... }, {...} ]
			var history = doc.history || [];

			log.info( "Team history length - " + history.length, { round: round, team: teamName } );

			// Get the previous round info from the history array:
			var prevRoundObj = _.findWhere( history, { round: round - 1 } ) || {};

			log.debug( "Prev team history obj " + ( prevRoundObj.round ? "" : "not " ) + "found", { round: round, team: teamName } );

			// Make the curret round info:
			var currRoundObj = TeamHelpers.makeHistory( round, goalsScored, goalsConcdd, prevRoundObj, wasHomeGame );

			// Remove the current round info ( if it exists ) from the history array:
			var idx = _.findIndex( history, { round: round } );
			if( idx !== -1 ) {
				log.debug( "Removing curr team history object", { round: round, team: teamName } );
				// The current round info exists, remove it:
				history.splice( idx, 1 );
			}
			// Push the new current round info:
			history.push( currRoundObj );

			log.info( "New team history length - " + history.length, { round: round, team: teamName } );
			log.debug( "Team history update finished", { round: round, team: teamName } );

			return TeamHistoryUtils.upsert( { _id: doc._id }, { history: history } );
		});
};