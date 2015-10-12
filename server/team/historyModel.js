// IMPORT ALL THE DEPENDENCIES
// =============================================================
var mongoose = require( "mongoose" );


// Variables:
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;


// Define the team history schema:
var TeamHistorySchema = new Schema({
	team    : { type: String, required: true },
	teamId  : { type: ObjectId, required: true, unique: true },
	rounds  : Object, // can be used as a virtual field
	history : [{
		_id         : false,
		round       : Number,
		wasHomeGame : Boolean,
		cumScored   : Number,
		cumConceded : Number,
		cumWins     : Number,
		cumDraws    : Number,
		cumLosses   : Number
	}]
});


// Define the team history model:
var collectionName   = "teamhistory";
var TeamHistoryModel = mongoose.model( "TeamHistory", TeamHistorySchema, collectionName );


module.exports = TeamHistoryModel;