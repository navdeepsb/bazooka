// IMPORT ALL THE DEPENDENCIES
// =============================================================
var mongoose = require( "mongoose" );
var Schema   = mongoose.Schema;


// Define the team schema:
var TeamSchema = new Schema({
	name    : { type: String, default: "", unique: true },
	abbr    : { type: String, default: "" },
	crest   : { type: String, default: "" },
	stadium : { type: String, default: "" },
	city    : { type: String, default: "" },
	country : { type: String, default: "" },
	rounds  : { type: Object, default: {} },
	inFirstDivision: Boolean
});


// Define the team model:
var TeamModel = mongoose.model( "Team", TeamSchema );


module.exports = TeamModel;