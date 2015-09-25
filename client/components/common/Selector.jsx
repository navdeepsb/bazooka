// IMPORT ALL THE DEPENDENCIES
// =============================================================
var React = require( "react" );


// Helper component for creating the `option`:
var OptionWrapper = React.createClass({
	render: function() {
		var item = this.props.item;
		return <option value={ item._id }>{ item.name }</option>;
	}
});


// Define the main component:
var Selector = React.createClass({

	unselectedVal: -1,

	getInitialState: function() {
		return {
			value   : this.props.initialValue || this.unselectedVal,
			isEmpty : false
		};
	},

	validate: function() {
		var val = this.state.value;

		this.setState({
			isEmpty : val === this.unselectedVal
		});
	},

	_handleChange: function( event ) {
		var val = event.target.value;

		this.setState({
			value   : val,
			isEmpty : val === this.unselectedVal
		});

		// Call the props method if it is supplied:
		if( this.props.onChange ) {
			this.props.onChange( event );
		}
	},

	render: function() {
		return (
			<select
				className={ "dropdown" + ( this.props.isRequired && this.state.isEmpty ? " dropdown--error" : "" ) }
				value={ this.state.value }
				onChange={ this._handleChange }>

				<OptionWrapper
					item={{ _id: this.unselectedVal, name: this.props.caption }} />

				{ this.props.options.map( function( item, idx ) {
					return <OptionWrapper key={ idx } item={ item } />;
				}.bind( this )) }

			</select>
		);
	}
});


module.exports = Selector;