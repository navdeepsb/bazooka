// IMPORT ALL THE DEPENDENCIES
// =============================================================
var React      = require( "react" );
var SignupForm = require( "./components/SignupForm" );


React.render(
	<SignupForm
		submitUrl="/user/signup"
		redirectTo="/account-created" />,
	document.getElementById( "form" )
);