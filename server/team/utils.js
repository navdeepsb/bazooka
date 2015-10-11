exports.makeHistory = function( round, goals, concd, prevRound, wasHomeGame ) {
	return {
		round       : round,
		wasHomeGame : wasHomeGame,
		cumScored   : goals + ( prevRound.cumScored   || 0 ),
		cumConceded : concd + ( prevRound.cumConceded || 0 ),
		cumWins     : ( goals  >  concd ? 1 : 0 ) + ( prevRound.cumWins   || 0 ),
		cumDraws    : ( goals === concd ? 1 : 0 ) + ( prevRound.cumDraws  || 0 ),
		cumLosses   : ( goals  <  concd ? 1 : 0 ) + ( prevRound.cumLosses || 0 )
	};
};

exports.getGoals = function( goals, penalties ) {
	var penaltiesConverted = 0;

	// Yeah, I know I can use `Array.prototype.filer` but lets be verbose:
	for( var idx = 0, len = ( penalties || [] ).length; idx < len; idx++ ) {
		if( !penalties[ idx ].isMissed ) {
			penaltiesConverted++;
		}
	}

	return ( goals || [] ).length + penaltiesConverted;
};

exports.getWinner = function( home, away ) {
	var hGoals = ( home.goals || [] ).length + ( home.penalties || [] ).length;
	var aGoals = ( away.goals || [] ).length + ( away.penalties || [] ).length;

	return hGoals !== aGoals ? hGoals > aGoals ? "home" : "away" : "";
};