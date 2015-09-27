// IMPORT ALL THE DEPENDENCIES
// =============================================================
var mongoose = require( "mongoose" );
var Schema   = mongoose.Schema;


// Define the team schema:
var TeamSchema = new Schema({
	name    : { type: String, required: true, unique: true },
	abbr    : { type: String, required: true },
	crest   : String,
	stadium : { type: String, required: true },
	city    : { type: String, required: true },
	country : { type: String, required: true },
	rounds  : { type: Object, default: {} },
	inFirstDivision: Boolean
});


// Define the team model:
var TeamModel = mongoose.model( "Team", TeamSchema );


module.exports = TeamModel;