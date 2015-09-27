// IMPORT ALL THE DEPENDENCIES
// =============================================================
var mongoose = require( "mongoose" );
var Schema   = mongoose.Schema;


// Define the admin schema:
var AdminSchema = new Schema({
	username : { type: String, required: true, unique: true },
	password : { type: String, required: true }
});


// Define the admin model:
var AdminModel = mongoose.model( "Admin", AdminSchema );


module.exports = AdminModel;