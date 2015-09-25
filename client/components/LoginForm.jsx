// IMPORT ALL THE DEPENDENCIES
// =============================================================
var $      = require( "jquery" );
var React  = require( "react" );
var Input  = require( "./common/Input" );


// The main component:
var LoginForm = React.createClass({

	getInitialState: function() {
		return {
			username : "",
			password : ""
		};
	},

	_handleUsernameInput: function( event ) {
		this.setState({
			username: event.target.value
		});
	},

	_handlePasswordInput: function( event ) {
		this.setState({
			password: event.target.value
		});
	},

	_validateUsername: function( username ) {
		return !!username;
	},

	_validatePassword: function( password ) {
		return !!password;
	},

	_handleSubmit: function( event ) {
		event.preventDefault();

		if( this._validateUsername( this.state.username ) &&
			this._validatePassword( this.state.password ) ) {

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
						location.href = this.props.redirectTo.replace( "{{username}}", this.state.username );
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
			this.refs.password.validate();
		}
	},

	render: function() {
		return (
			<form name="login" className="form" onSubmit={ this._handleSubmit }>

				<Input
					ref="username"
					initialValue={ this.state.username }
					placeholder="Username"
					validator={ this._validateUsername }
					onChange={ this._handleUsernameInput } />

				<Input
					ref="password"
					initialValue={ this.state.password }
					type="password"
					placeholder="Password"
					validator={ this._validatePassword }
					onChange={ this._handlePasswordInput } />

				<p ref="serverError" className="warn"></p>

				<button className="btn">Login</button>

				<p>Not a member? <a href="/signup">Signup</a></p>
			</form>
		);
	}
});


module.exports = LoginForm;