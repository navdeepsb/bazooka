// IMPORT ALL THE DEPENDENCIES
// =============================================================
var mongoose = require( "mongoose" );
var Schema   = mongoose.Schema;


// Define the user schema:
var UserSchema = new Schema({
	username    : { type: String, required: true, unique: true },
	email       : { type: String, required: true, unique: true },
	teamName    : { type: String, required: true },
	password    : { type: String, required: true },
	supporterOf : { type: String, required: true },
	createdOn   : { type: Number, default: Date.now() },
	updatedOn   : Number,
	isActivated : { type: Boolean, default: false },
});


// Run the below function before every 'save'
UserSchema.pre( "save", function( next ) {
	// Change the updatedOn field to current date
	this.updatedOn = Date.now();

	next();
});


// Define the user model:
var UserModel = mongoose.model( "User", UserSchema );


module.exports = UserModel;