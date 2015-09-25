// IMPORT ALL THE DEPENDENCIES
// =============================================================
var $              = require( "jquery" );
var React          = require( "react" );
var Input          = require( "./common/Input" );
var Selector       = require( "./common/Selector" );
var UnmValidator   = require( "../validators/username" );
var EmailValidator = require( "../validators/email" );
var PwdValidator   = require( "../validators/password" );
var countries      = require( "../data/countries" );
var teams          = require( "../data/teams" );


// The main component:
var SignupForm = React.createClass({

	getInitialState: function() {
		return {
			username    : "",
			email       : "",
			teamName    : "",
			password    : "",
			country     : "",
			supporterOf : ""
		};
	},

	_handleUsernameInput: function( event ) {
		this.setState({
			username: event.target.value
		});
	},

	_handleEmailInput: function( event ) {
		this.setState({
			email: event.target.value
		});
	},

	_handleTeamInput: function( event ) {
		this.setState({
			teamName: event.target.value
		});
	},

	_handlePasswordInput: function( event ) {
		this.setState({
			password: event.target.value
		});
	},

	_handleCountryChange: function( event ) {
		this.setState({
			country: event.target.selectedOptions[ 0 ].innerHTML
		});
	},

	_handleFavTeamChange: function( event ) {
		this.setState({
			supporterOf: event.target.selectedOptions[ 0 ].innerHTML
		});
	},

	_validateUsername: function( unm ) {
		return UnmValidator.isValid( unm );
	},

	_validateEmail: function( email ) {
		return EmailValidator.isValid( email );
	},

	_validateTeam: function( teamName ) {
		return !!teamName.trim() && !teamName.endsWith( " " ) && !teamName.startsWith( " " );
	},

	_validatePassword: function( password ) {
		return PwdValidator.isValid( password );
	},

	_validateConfirmPassword: function( password ) {
		return this.refs.password.state.value === password;
	},

	_validateSelector: function( value ) {
		return !!value;
	},

	_handleSubmit: function( event ) {
		event.preventDefault();

		if( this._validateUsername( this.state.username ) &&
			this._validateEmail( this.state.email ) &&
			this._validateTeam( this.state.teamName ) &&
			this._validatePassword( this.state.password ) &&
			this._validateConfirmPassword( this.refs.confirmPassword.state.value ) &&
			this._validateSelector( this.state.country ) &&
			this._validateSelector( this.state.supporterOf ) ) {

			// Form ready for submit:
			$.ajax({
				url     : this.props.submitUrl,
				method  : "POST",
				data    : this.state,
				context : this,
				success : function( response ) {
					if( response.customCode !== 0 ) {
						React.findDOMNode( this.refs.serverError ).innerText = response.message;
					}
					else {
						location.href = this.props.redirectTo;
					}
				},
				error   : function( response ) {
					console.log( "ERROR - Response:", response );
				}
			});
		}
		else {
			// Invalid form, validate all fields:
			this.refs.username.validate();
			this.refs.email.validate();
			this.refs.teamName.validate();
			this.refs.password.validate();
			this.refs.confirmPassword.validate();
			this.refs.country.validate();
			this.refs.supporterOf.validate();
		}
	},

	render: function() {
		return (
			<form name="signup" className="form" onSubmit={ this._handleSubmit }>

				<Input
					ref="username"
					initialValue={ this.state.username }
					placeholder="Username"
					validator={ this._validateUsername }
					onChange={ this._handleUsernameInput } />

				<Input
					ref="email"
					initialValue={ this.state.email }
					placeholder="Email address"
					validator={ this._validateEmail }
					onChange={ this._handleEmailInput } />

				<Input
					ref="teamName"
					initialValue={ this.state.teamName }
					placeholder="Team name"
					validator={ this._validateTeam }
					onChange={ this._handleTeamInput } />

				<Input
					ref="password"
					initialValue={ this.state.password }
					type="password"
					placeholder="Password"
					validator={ this._validatePassword }
					onChange={ this._handlePasswordInput } />

				<Input
					ref="confirmPassword"
					initialValue=""
					type="password"
					placeholder="Confirm Password"
					validator={ this._validateConfirmPassword } />

				<Selector
					ref="country"
					caption="Your country"
					options={ countries }
					initialValue={ this.state.country }
					isRequired={ true }
					onChange={ this._handleCountryChange } />

				<Selector
					ref="supporterOf"
					caption="Supporter of..."
					options={ teams }
					initialValue={ this.state.supporterOf }
					isRequired={ true }
					onChange={ this._handleFavTeamChange } />

				<p ref="serverError" className="warn"></p>

				<button className="btn">Signup</button>

				<p>Already a member? <a href="/login">Login</a></p>
			</form>
		);
	}
});


module.exports = SignupForm;