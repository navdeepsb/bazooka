// IMPORT ALL THE DEPENDENCIES
// =============================================================
var React     = require( "react" );
var Standings = require( "./components/Standings" );


React.render(
	<Standings
		getCurrRoundUrl="/currentround/"
		getStandingsUrl="/api/teamstats/" />,
	document.getElementById( "table" )
);