// Define a middleware for allowing only logged-in admins
// to view some pages of the website:
var authenticate = function( req, res, next ) {
	if( req.session.admin ) {
		// Admin is logged in...
		next();
	}
	else {
		// Redirect to the admin login page:
		res.redirect( "/admin/login" );
	}
};


module.exports = authenticate;