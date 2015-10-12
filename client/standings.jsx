// IMPORT ALL THE DEPENDENCIES
// =============================================================
var React     = require( "react" );
var Standings = require( "./components/Standings" );


React.render(
	<Standings
		getStandingsUrl="/api/teamstats/" />,
	document.getElementById( "table" )
);