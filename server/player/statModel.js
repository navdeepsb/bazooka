// IMPORT ALL THE DEPENDENCIES
// =============================================================
var mongoose = require( "mongoose" );


// Variables:
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;


// Define the player stats schema:
var PlayerStatsSchema = new Schema({
	player   : { type: String, required: true },
	playerId : { type: ObjectId, required: true, unique: true },
	stats    : [{
		// Don't need mongoose to create unnecessary object ids:
		_id : false,

		// The current round #
		round : Number,

		// The team represented by the player
		team : String,

		// Goals scored related
		cumAssists  : Number,
		cumGoals    : Number,
		cumOwnGoals : Number,

		// Penalties related
		cumPenaltyGoals  : Number,
		cumPenaltiesWon  : Number,
		cumPenaltyFaults : Number,
		cumPenaltySaves  : Number,
		cumPenaltyMisses : Number,

		// Clean sheets related
		cumCleanSheets : Number,

		// Fouls related
		cumYellowCards : Number,
		cumRedCards    : Number,

		// Start/sub related
		cumStarts        : Number,
		cumSubIns        : Number,
		cumMinutesPlayed : Number,

		// Overall result related
		cumWins : Number
	}]
});


// Define the player stat model:
var collectionName   = "playerstats";
var PlayerStatsModel = mongoose.model( "PlayerStats", PlayerStatsSchema, collectionName );


module.exports = PlayerStatsModel;