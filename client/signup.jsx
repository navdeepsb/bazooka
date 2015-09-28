// IMPORT ALL THE DEPENDENCIES
// =============================================================
var React      = require( "react" );
var SignupForm = require( "./components/SignupForm" );


React.render(
	<SignupForm
		submitUrl="/user/signup"
		getTeamsUrl="/api/teams"
		redirectTo="/account-created" />,
	document.getElementById( "form" )
);