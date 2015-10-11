// IMPORT ALL THE DEPENDENCIES
// =============================================================
var $         = require( "jquery" );
var React     = require( "react/addons" );
var Input     = require( "../components/common/Input" );
var Selector  = require( "../components/common/Selector" );


// Constants:
var DEF_GOAL_JSON = '[ { "player": { "id": "", "name": "" }, "assistBy": { "id": "", "name": "" }, "minute": 0, "isOwnGoal": false } ]';
var DEF_SUB_JSON  = '[ { "in": { "id": "", "name": "" }, "out": { "id": "", "name": "" }, "minute": 0 } ]';
var DEF_CARD_JSON = '[ { "player": { "id": "", "name": "" }, "minute": 0, "isRed": false } ]';
var DEF_PENALTY_JSON = '[ { "wonBy": { "id": "", "name": "" }, "faultBy": { "id": "", "name": "" }, "player": { "id": "", "name": "" }, "stopper": { "id": "", "name": "" }, "minute": 0, "isMissed": false } ]';


// Component listing the players:
var PlayerList = React.createClass({

	propType: {
		teamType       : React.PropTypes.string.isRequired,
		onTeamChange   : React.PropTypes.func.isRequired,
		onPlayerChange : React.PropTypes.func.isRequired
	},

	getInitialState: function() {
		return {
			team       : this.props.team,
			players    : this.props.players,
			allPlayers : []
		};
	},

	_handleSelectorChange: function( event ) {
		// Get the selector caption:
		var dispText    = event.target.selectedOptions[ 0 ].innerHTML;

		// Get the properties:
		var teamId      = event.target.value;
		var teamName    = dispText.split( ", " )[ 0 ];
		var stadiumName = dispText.split( ", " )[ 1 ];

		// Update the state:
		this.setState({ team: teamName });

		// Fetch players of this team:
		$.ajax({
			url      : this.props.getPlayersUrl + "?team=" + teamName,
			type     : "GET",
			dataType : "json",
			context  : this,
			success  : function( response ) {
				this.setState({
					players    : [],
					allPlayers : response.players || []
				});
			}
		});

		// Call the prop function too:
		this.props.onTeamChange( teamId, teamName, stadiumName, event );
	},

	_handlePlayerChange: function( pid, pname, event ) {
		var isChecked = event.target.checked;

		var _players = this.state.players;

		if( isChecked ) {
			// Push this player into the player array:
			_players.push({ id: pid, name: pname });
		}
		else {
			// Remove the player from the array:
			for( var idx = 0, len = _players.length; idx < len; idx ++ ) {
				if( _players[ idx ].id === pid ) {
					_players.splice( idx, 1 );
					break;
				}
			}
		}

		// Set the state:
		this.setState({ players: _players });

		// Call the prop function too:
		this.props.onPlayerChange( _players, this.props.teamType, event );
	},

	render: function() {
		return (
			<div>
				<Selector
					caption="Select a team"
					options={ this.props.allTeams }
					initialValue={ this.state.team }
					onChange={ this._handleSelectorChange } />

				<p className="no-margin right">
					Starters - { this.state.players.length }
				</p>

				{ this.state.allPlayers.map( function( player, idx ) {
					return (
						<p key={ idx } className="no-margin">
							<input
								id={ player._id }
								type="checkbox"
								onChange={ this._handlePlayerChange.bind( this, player._id, player.name ) } />

							<label htmlFor={ player._id }>
								<span className="mono">{ player.position }</span> - { player.name }
							</label>
						</p>
					);
				}.bind( this )) }

				<button className="btn">{ this.props.btnText }</button>
			</div>
		);
	}
});

// Component handling various events like goal, card, etc.
var FixtureEvent = React.createClass({

	getInitialState: function() {
		return {
			value : this.props.initialValue
		};
	},

	_handleChange: function( event ) {
		var val = event.target.value;

		this.setState({ value : val });

		// Call the props method if it is supplied:
		if( this.props.onChange ) {
			this.props.onChange( event );
		}
	},

	render: function() {
		return (
			<div>
				<p className="no-margin">{ this.props.caption }</p>
				<textarea
					value={ this.state.value }
					className="txt txt__area"
					onChange={ this._handleChange } />
				<button className="btn">{ this.props.btnText }</button>
			</div>
		);
	}
});

// The main form:
var FixtureForm = React.createClass({

	getInitialState: function() {
		var teamObj = {
			team      : "",
			teamId    : "",
			stadium   : "",
			players   : [],
			goals     : [],
			penalties : [],
			cards     : [],
			subs      : []
		};

		return {
			teams   : [],
			fixture : {
				round : "",
				date  : "",
				home  : teamObj,
				away  : teamObj
			},
		};
	},

	componentDidMount: function() {
		$.ajax({
			url      : this.props.getTeamsUrl,
			type     : "GET",
			dataType : "json",
			context  : this,
			success  : function( response ) {
				var _teams = ( response.teams || [] ).map( function( team ) {
					team.name += ", " + team.stadium;
					return team;
				});
				this.setState({ teams: _teams });
			}
		});
	},

	_dumpState: function() {
		console.log( "_dumpState()", this.state );
	},

	_saveFixture: function() {
		console.log( "To save:", JSON.stringify( this.state.fixture ) );

		$.ajax({
			url     : this.props.submitUrl,
			method  : "POST",
			data    : this.state.fixture,
			context : this,
			success : function( response ) {
				console.log( "SUCCESS - Response:", response );
			},
			error   : function( response ) {
				console.log( "ERROR - Response:", response );
			}
		});
	},

	_handleRoundInput: function( event ) {
		this.setState( React.addons.update( this.state, {
			fixture: {
				round: { $set: parseInt( event.target.value, 10 ) }
			}
		}));
	},

	_handleDateInput: function( event ) {
		this.setState( React.addons.update( this.state, {
			fixture: {
				date: { $set: event.target.value }
			}
		}));
	},

	_handleHomeTeamChange: function( teamId, teamName, stadiumName, event ) {
		// Set the team:
		this.setState( React.addons.update( this.state, {
			fixture: {
				home: {
					team    : { $set: teamName },
					teamId  : { $set: teamId },
					stadium : { $set: stadiumName }
				}
			}
		}));
	},

	_handleAwayTeamChange: function( teamId, teamName, stadiumName, event ) {
		// Set the team:
		this.setState( React.addons.update( this.state, {
			fixture: {
				away: {
					team    : { $set: teamName },
					teamId  : { $set: teamId },
					stadium : { $set: stadiumName }
				}
			}
		}));
	},

	_handlePlayerChange: function( players, teamType, event ) {
		var _fixture = this.state.fixture;

		// Set the new player list:
		_fixture[ teamType ].players = players;

		// And finally, update the state:
		this.setState({ fixture: _fixture });
	},

	_handleHomeGoalInput: function( event ) {
		// Set the goal:
		this.setState( React.addons.update( this.state, {
			fixture: {
				home: {
					goals: { $set: JSON.parse( event.target.value ) }
				}
			}
		}));
	},

	_handleAwayGoalInput: function( event ) {
		// Set the goal:
		this.setState( React.addons.update( this.state, {
			fixture: {
				away: {
					goals: { $set: JSON.parse( event.target.value ) }
				}
			}
		}));
	},

	_handleHomeSubInput: function( event ) {
		// Set the sub:
		this.setState( React.addons.update( this.state, {
			fixture: {
				home: {
					subs: { $set: JSON.parse( event.target.value ) }
				}
			}
		}));
	},

	_handleAwaySubInput: function( event ) {
		// Set the sub:
		this.setState( React.addons.update( this.state, {
			fixture: {
				away: {
					subs: { $set: JSON.parse( event.target.value ) }
				}
			}
		}));
	},

	_handleHomeCardInput: function( event ) {
		// Set the card:
		this.setState( React.addons.update( this.state, {
			fixture: {
				home: {
					cards: { $set: JSON.parse( event.target.value ) }
				}
			}
		}));
	},

	_handleAwayCardInput: function( event ) {
		// Set the card:
		this.setState( React.addons.update( this.state, {
			fixture: {
				away: {
					cards: { $set: JSON.parse( event.target.value ) }
				}
			}
		}));
	},

	_handleHomePenaltyInput: function( event ) {
		// Set the penalty:
		this.setState( React.addons.update( this.state, {
			fixture: {
				home: {
					penalties: { $set: JSON.parse( event.target.value ) }
				}
			}
		}));
	},

	_handleAwayPenaltyInput: function( event ) {
		// Set the penalty:
		this.setState( React.addons.update( this.state, {
			fixture: {
				away: {
					penalties: { $set: JSON.parse( event.target.value ) }
				}
			}
		}));
	},

	render: function() {
		return (
			<div>
				<button className="btn" onClick={ this._saveFixture }>Save match</button>
				&nbsp;
				<button className="btn">Send match start update</button>
				&nbsp;
				<button className="btn">Send half-time update</button>
				&nbsp;
				<button className="btn">Send match end update</button>
				&nbsp;
				<button className="btn" onClick={ this._dumpState }>Dump JSON</button>
				<br />
				<br />

				<div className="grid">
					<div className="col col-6 form">
						<Input
							ref="round"
							type="number"
							min="1"
							max="38"
							placeholder="Round #"
							onChange={ this._handleRoundInput } />
					</div>
					<div className="col col-6 form">
						<Input
							ref="date"
							type="text"
							placeholder="Match date"
							onChange={ this._handleDateInput } />
					</div>
				</div>

				<div className="grid">
					<div className="col col-6 form">
						<p className="no-margin">Home</p>

						<PlayerList
							teamType="home"
							allTeams={ this.state.teams }
							team={ this.state.fixture.home.team }
							players={ this.state.fixture.home.players }
							onTeamChange={ this._handleHomeTeamChange }
							onPlayerChange={ this._handlePlayerChange }
							btnText="Send home team update"
							getPlayersUrl={ this.props.getPlayersUrl } />

						<FixtureEvent
							initialValue={ DEF_GOAL_JSON }
							caption="Home goals"
							btnText="Send home goal update"
							onChange={ this._handleHomeGoalInput } />

						<FixtureEvent
							initialValue={ DEF_SUB_JSON }
							caption="Home subs"
							btnText="Send home sub update"
							onChange={ this._handleHomeSubInput } />

						<FixtureEvent
							initialValue={ DEF_CARD_JSON }
							caption="Home cards"
							btnText="Send home card update"
							onChange={ this._handleHomeCardInput } />

						<FixtureEvent
							initialValue={ DEF_PENALTY_JSON }
							caption="Home penaties"
							btnText="Send home penalty update"
							onChange={ this._handleHomePenaltyInput } />
					</div>

					<div className="col col-6 form">
						<p className="no-margin">Away</p>

						<PlayerList
							teamType="away"
							allTeams={ this.state.teams }
							team={ this.state.fixture.away.team }
							players={ this.state.fixture.away.players }
							onTeamChange={ this._handleAwayTeamChange }
							onPlayerChange={ this._handlePlayerChange }
							btnText="Send away team update"
							getPlayersUrl={ this.props.getPlayersUrl } />

						<FixtureEvent
							initialValue={ DEF_GOAL_JSON }
							caption="Away goals"
							btnText="Send away goal update"
							onChange={ this._handleAwayGoalInput } />

						<FixtureEvent
							initialValue={ DEF_SUB_JSON }
							caption="Away subs"
							btnText="Send away sub update"
							onChange={ this._handleAwaySubInput } />

						<FixtureEvent
							initialValue={ DEF_CARD_JSON }
							caption="Away cards"
							btnText="Send away card update"
							onChange={ this._handleAwayCardInput } />

						<FixtureEvent
							initialValue={ DEF_PENALTY_JSON }
							caption="Away penaties"
							btnText="Send away penalty update"
							onChange={ this._handleAwayPenaltyInput } />
					</div>
				</div>
			</div>
		);
	}
});


module.exports = FixtureForm;