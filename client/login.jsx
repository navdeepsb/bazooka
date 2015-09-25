// IMPORT ALL THE DEPENDENCIES
// =============================================================
var React     = require( "react" );
var LoginForm = require( "./components/LoginForm" );


React.render(
	<LoginForm
		submitUrl="/api/user/login"
		redirectTo="/{{username}}/team" />,
	document.getElementById( "form" )
);