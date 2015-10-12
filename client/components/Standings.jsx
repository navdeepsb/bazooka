// IMPORT ALL THE DEPENDENCIES
// =============================================================
var $        = require( "jquery" );
var React    = require( "react" );


// The main component:
var Standings = React.createClass({

	getInitialState: function() {
		return {
			round : 1,
			stats : []
		};
	},

	componentDidMount: function() {
		$.ajax({
			url      : this.props.getStandingsUrl + this.state.round,
			type     : "GET",
			dataType : "json",
			context  : this,
			success  : function( response ) {
				this.setState({ stats: response.stats });
			}
		});
	},

	render: function() {
		return (
			<div>
				<p>Round { this.state.round } <a href={ "/matches/" + this.state.round }>view fixtures</a></p>
				<table>
					<thead>
						<tr className="bold">
							<td></td>
							<td>#</td>
							<td>Team</td>
							<td>Points</td>
							<td>Wins</td>
							<td>Draws</td>
							<td>Losses</td>
							<td>Scored</td>
							<td>Conceded</td>
						</tr>
					</thead>
					{ this.state.stats.map( function( obj, idx ) {
						var currRound = obj.rounds[ this.state.round ];
						return (
							<tr key={ idx }>
								<td>&nbsp;&nbsp;</td>
								<td>{ idx + 1 }</td>
								<td>{ obj.team }</td>
								<td>{ currRound.cumWins * 3 + currRound.cumDraws * 1 }</td>
								<td>{ currRound.cumWins }</td>
								<td>{ currRound.cumDraws }</td>
								<td>{ currRound.cumLosses }</td>
								<td>{ currRound.cumScored }</td>
								<td>{ currRound.cumConceded }</td>
							</tr>
						);
					}.bind( this ) ) }
				</table>
			</div>
		);
	}
});


module.exports = Standings;