// IMPORT ALL THE DEPENDENCIES
// =============================================================
var $       = require( "jquery" );
var React   = require( "react" );
var matches = require( "../data/matches" );


// The single match component:
var Match = React.createClass({

	_getGoalString: function( goals ) {
		var retVal = "";
		var scorerMap = {};

		goals.forEach( function( goal ) {
			var scorer  = goal.scorer;
			var additionalInfo = goal.isPenalty ? "(pen.) " : "";

			if( scorerMap[ scorer ] ) {
				// Scorer already exists
				scorerMap[ scorer ] += ", " + additionalInfo + goal.minute + "'";
			}
			else {
				// New scorer
				scorerMap[ scorer ] = scorer + " " + additionalInfo + goal.minute + "'";
			}
		});

		for( var key in scorerMap ) {
			retVal += scorerMap[ key ] + "<br />";
		}

		return retVal;
	},

	render: function() {
		var match = this.props.data;
		var home  = match.home;
		var away  = match.away;
		var inlineBlockStyle = {
			display: "inline-block",
			width: "50%",
			verticalAlign: "top",
			lineHeight: 1.5
		};

		return (
			<div className="match__card">
				<table width="100%">
					<tr className="small">
						<td>{ home.stadium }</td>
						<td className="right">{ match.date }</td>
					</tr>
				</table>
				<table width="100%">
					<tr>
						<td width="33%">
							<strong>{ home.team }</strong>
						</td>
						<td width="33%" className="center">
							<h1>{ home.goals.length } - { away.goals.length }</h1>
						</td>
						<td width="33%" className="right">
							<strong>{ away.team }</strong>
						</td>
					</tr>
				</table>
				<div>
					<div className="small" style={ inlineBlockStyle } dangerouslySetInnerHTML={{ __html: this._getGoalString( home.goals ) }} />
					<div className="small right" style={ inlineBlockStyle } dangerouslySetInnerHTML={{ __html: this._getGoalString( away.goals ) }} />
				</div>
				<p className="center no-margin">
					<a href="/matches" className="small">view detail</a>
				</p>
			</div>
		);
	}
});


// The main component:
var MatchListing = React.createClass({

	getInitialState: function() {
		var currRound = location.href.substr( location.href.lastIndexOf( "/" ) + 1 );

		return {
			round: currRound,
			matchList: matches[ currRound ] || []
		};
	},

	render: function() {
		return (
			<div id="allMatches">
				{ this.state.matchList.map( function( match, idx ) {
					return <Match key={ idx } data={ match } />;
				} ) }
			</div>
		);
	}
});


module.exports = MatchListing;