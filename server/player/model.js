// IMPORT ALL THE DEPENDENCIES
// =============================================================
var mongoose        = require( "mongoose" );
var Schema          = mongoose.Schema;
var VALID_POSITIONS = require( "../data/playingPositions" );
var VALID_STATUS    = require( "../data/playerStatus" );


// Define the player schema:
var PlayerSchema = new Schema({
	name      : { type: String, default: "" },
	picture   : { type: String, default: "/img/player-placeholder.jpg" },
	team      : { type: String, default: "" },
	worth     : { type: Number, default: 0 },
	jerseyNum : { type: Number, default: 0 },
	position  : { type: String, default: VALID_POSITIONS[ 0 ], enum: VALID_POSITIONS },
	status    : { type: String, default: VALID_STATUS[ 0 ], enum: VALID_STATUS },
	pointsHistory : { type: Object, default: {} }
});


// Define the player model:
var PlayerModel = mongoose.model( "Player", PlayerSchema );


module.exports = PlayerModel;