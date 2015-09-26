// Define a middleware for allowing only logged-in users
// to view some pages of the website:
var authenticate = function( req, res, next ) {
	if( req.session.user ) {
		// User is logged in...
		next();
	}
	else {
		// Redirect to the login page:
		res.redirect( "/login" );
	}
};


module.exports = authenticate;