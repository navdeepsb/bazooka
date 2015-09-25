// IMPORT ALL THE DEPENDENCIES
// =============================================================
var React = require( "react" );


// Define the main component:
var Input = React.createClass({

	propTypes: {
		validator : React.PropTypes.func
	},

	getInitialState: function() {
		return {
			value   : this.props.initialValue,
			isValid : true
		};
	},

	validate: function() {
		var val = this.state.value;

		this.setState({
			isValid : this.props.validator ? this.props.validator( val ) : true
		});
	},

	_handleChange: function( event ) {
		var val = event.target.value;

		this.setState({
			value   : val,
			isValid : this.props.validator ? this.props.validator( val ) : true
		});

		// Call the props method if it is supplied:
		if( this.props.onChange ) {
			this.props.onChange( event );
		}
	},

	render: function() {
		return (
			<input
				{ ...this.props }
				className={ "txt" + ( this.state.isValid ? "" : " txt--error" ) }
				value={ this.state.value }
				placeholder={ this.props.placeholder }
				onChange={ this._handleChange }
				autoComplete="off" />
		);
	}
});


module.exports = Input;