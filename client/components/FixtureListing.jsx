// IMPORT ALL THE DEPENDENCIES
// =============================================================
var $        = require( "jquery" );
var React    = require( "react" );
var Selector = require( "./common/Selector" );


// The single fixture component:
var Fixture = React.createClass({

	_getGoals: function( goals, penalties ) {
		return goals.length + penalties.filter( function( penalty ) {
			return !penalty.isMissed;
		}).length;
	},

	_getGoalString: function( goals, penalties ) {
		var retVal = "";
		var scorerMap = {};

		goals.forEach( function( goal ) {
			var scorer = goal.player.name;
			var additionalInfo = goal.isOwnGoal ? "(o.g.) " : "";

			if( scorerMap[ scorer ] ) {
				// Scorer already exists
				scorerMap[ scorer ] += ", " + additionalInfo + goal.minute + "'";
			}
			else {
				// New scorer
				scorerMap[ scorer ] = scorer + " " + additionalInfo + goal.minute + "'";
			}
		});

		penalties.forEach( function( penalty ) {
			var player = penalty.player.name;

			if( penalty.isMissed ) {
				return;
			}

			if( scorerMap[ player ] ) {
				// Scorer already exists
				scorerMap[ player ] += ", (pen.) " + penalty.minute + "'";
			}
			else {
				// New scorer
				scorerMap[ player ] = player + " (pen.) " + penalty.minute + "'";
			}
		});

		for( var key in scorerMap ) {
			retVal += scorerMap[ key ] + "<br />";
		}

		return retVal;
	},

	render: function() {
		var fixture = this.props.data;
		var home  = fixture.home;
		var away  = fixture.away;
		var inlineBlockStyle = {
			display: "inline-block",
			width: "50%",
			verticalAlign: "top",
			lineHeight: 1.5
		};

		return (
			<div className="fixture__card">
				<table width="100%">
					<tr className="small">
						<td>{ home.stadium }</td>
						<td className="right">{ fixture.date }</td>
					</tr>
				</table>
				<table width="100%">
					<tr>
						<td width="33%">
							<strong>{ home.team }</strong>
						</td>
						<td width="33%" className="center">
							<h1>{ this._getGoals( home.goals, home.penalties ) } - { this._getGoals( away.goals, away.penalties ) }</h1>
						</td>
						<td width="33%" className="right">
							<strong>{ away.team }</strong>
						</td>
					</tr>
				</table>
				<div>
					<div className="small" style={ inlineBlockStyle } dangerouslySetInnerHTML={{ __html: this._getGoalString( home.goals, home.penalties ) }} />
					<div className="small right" style={ inlineBlockStyle } dangerouslySetInnerHTML={{ __html: this._getGoalString( away.goals, away.penalties ) }} />
				</div>
				<p className="center no-margin">
					<a href="/fixtures" className="small">view detail</a>
				</p>
			</div>
		);
	}
});


// The main component:
var FixtureListing = React.createClass({

	getInitialState: function() {
		return {
			round       : 1,
			fixtureList   : [],
			validRounds : []
		};
	},

	componentDidMount: function() {
		// 1) Get the current round:
		$.ajax({
			url      : this.props.getCurrRoundUrl,
			type     : "GET",
			dataType : "json",
			context  : this,
			success  : function( response ) {
				this.setState({ round: response.round });
			}
		});

		// 2) Form the valid rounds array:
		var allRounds = [];
		var currRound = this.state.round;
		while( currRound > 0 ) {
			allRounds.push({ _id: currRound, name: currRound });
			currRound--;
		}
		this.setState({ validRounds: allRounds });

		// 3) Get the fixtures:
		this._getFixtures( this.state.round );
	},

	_getFixtures: function( round ) {
		$.ajax({
			url      : this.props.getFixturesUrl + round,
			type     : "GET",
			dataType : "json",
			context  : this,
			success  : function( response ) {
				this.setState({ fixtureList: response.fixtures });
			}
		});
	},

	_handleRoundChange: function( event ) {
		var round = parseInt( event.target.value, 10 );

		this._getFixtures( round );

		this.setState({ round: round });
	},

	render: function() {
		return (
			<div id="allFixtures">
				<p>
					Round
					&nbsp;
					<Selector
						caption="Select round"
						options={ this.state.validRounds }
						initialValue={ this.state.round }
						onChange={ this._handleRoundChange } />
					&nbsp;
					&nbsp;
					<a href={ "/standings" }>view standings</a>
				</p>

				{ this.state.fixtureList.map( function( fixture, idx ) {
					return <Fixture key={ idx } data={ fixture } />;
				} ) }
			</div>
		);
	}
});


module.exports = FixtureListing;