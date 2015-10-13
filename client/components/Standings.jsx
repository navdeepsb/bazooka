// IMPORT ALL THE DEPENDENCIES
// =============================================================
var $        = require( "jquery" );
var React    = require( "react" );
var Selector = require( "./common/Selector" );


// The main component:
var Standings = React.createClass({

	getInitialState: function() {
		return {
			round       : 1,
			stats       : [],
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

		// 3) Get the team stats:
		this._getStats( this.state.round );
	},

	_getStats: function( round ) {
		$.ajax({
			url      : this.props.getStandingsUrl + round,
			type     : "GET",
			dataType : "json",
			context  : this,
			success  : function( response ) {
				this.setState({ stats: response.stats });
			}
		});
	},

	_handleRoundChange: function( event ) {
		var round = parseInt( event.target.value, 10 );

		this._getStats( round );

		this.setState({ round: round });
	},

	render: function() {
		return (
			<div>
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
					<a href={ "/matches" }>view fixtures</a>
				</p>
				<table>
					<thead>
						<tr className="bold">
							<td></td>
							<td>#</td>
							<td>Team</td>
							<td>Played</td>
							<td>Wins</td>
							<td>Draws</td>
							<td>Losses</td>
							<td>Scored</td>
							<td>Conceded</td>
							<td>Points</td>
						</tr>
					</thead>
					{ this.state.stats.map( function( obj, idx ) {
						var currRound = obj.rounds[ this.state.round ];

						if( !currRound ) { return <tr key={ idx }></tr>; }

						return (
							<tr key={ idx }>
								<td>&nbsp;&nbsp;</td>
								<td>{ idx + 1 }</td>
								<td>{ obj.team }</td>
								<td>{ currRound.cumWins + currRound.cumDraws + currRound.cumLosses }</td>
								<td>{ currRound.cumWins }</td>
								<td>{ currRound.cumDraws }</td>
								<td>{ currRound.cumLosses }</td>
								<td>{ currRound.cumScored }</td>
								<td>{ currRound.cumConceded }</td>
								<td>{ currRound.cumWins * 3 + currRound.cumDraws * 1 }</td>
							</tr>
						);
					}.bind( this ) ) }
				</table>
			</div>
		);
	}
});


module.exports = Standings;