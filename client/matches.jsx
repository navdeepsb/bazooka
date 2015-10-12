// IMPORT ALL THE DEPENDENCIES
// =============================================================
var React        = require( "react" );
var MatchListing = require( "./components/MatchListing" );


React.render(
	<MatchListing
		getFixturesUrl="/api/fixtures?round=" />,
	document.getElementById( "matches" )
);