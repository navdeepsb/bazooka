// IMPORT ALL THE DEPENDENCIES
// =============================================================
var mongoose     = require( "mongoose" );
var VALID_ROUNDS = require( "../data/roundNums" );


// Variables:
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// Mini-schemas ( reusable ):
var goalsMiniSchema = [{
	_id       : false,
	player    : { id: ObjectId, name: String },
	assistBy  : { id: ObjectId, name: String },
	minute    : Number,
	isOwnGoal : { type: Boolean, default: false }
}];

var penaltiesMiniSchema = [{
	_id      : false,
	wonBy    : { id: ObjectId, name: String },
	faultBy  : { id: ObjectId, name: String },
	player   : { id: ObjectId, name: String },
	stopper  : { id: ObjectId, name: String },
	minute   : Number,
	isMissed : { type: Boolean, default: false }
}];

var cardsMiniSchema = [{
	_id    : false,
	player : { id: ObjectId, name: String },
	minute : Number,
	isRed  : { type: Boolean, default: false }
}];

var subsMiniSchema = [{
	_id    : false,
	in     : { id: ObjectId, name: String },
	out    : { id: ObjectId, name: String },
	minute : Number
}];

var teamMiniSchema = {
	team      : String,
	teamId    : { type: ObjectId, required: true },
	stadium   : String,
	players   : [{ _id: false, id: ObjectId, name: String }],
	goals     : goalsMiniSchema,
	penalties : penaltiesMiniSchema,
	cards     : cardsMiniSchema,
	subs      : subsMiniSchema
};


// Define the fixture / match schema:
var FixtureSchema = new Schema({
	round : { type: Number, default: VALID_ROUNDS[ 0 ], enum: VALID_ROUNDS },
	date  : String,
	home  : teamMiniSchema,
	away  : teamMiniSchema
});


// Define the Fixture model:
var FixtureModel = mongoose.model( "Fixture", FixtureSchema );


module.exports = FixtureModel;