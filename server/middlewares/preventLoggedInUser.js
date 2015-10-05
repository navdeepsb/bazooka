// Define a middleware for preventing logged-in users
// to access some pages like `/login`, etc.:
var preventLoggedInUser = function( req, res, next ) {
	if( req.session.user ) {
		// User is logged in, redirect to home...
		res.redirect( "/" );
	}
	else {
		// Proceed as normal:
		next();
	}
};


module.exports = preventLoggedInUser;