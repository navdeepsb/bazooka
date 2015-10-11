// IMPORT ALL THE DEPENDENCIES
// =============================================================
var React       = require( "react" );
var FixtureForm = require( "../components/FixtureForm" );


React.render(
	<FixtureForm
		submitUrl="/admin/fixture"
		getTeamsUrl="/api/teams?select=name,stadium"
		getPlayersUrl="/api/players" />,
	document.getElementById( "form" )
);