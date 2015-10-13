// IMPORT ALL THE DEPENDENCIES
// =============================================================
var React          = require( "react" );
var FixtureListing = require( "./components/FixtureListing" );


React.render(
	<FixtureListing
		getCurrRoundUrl="/currentround/"
		getFixturesUrl="/api/fixtures?round=" />,
	document.getElementById( "fixtures" )
);