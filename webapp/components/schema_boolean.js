import Inferno from 'inferno'
import Component from 'inferno-component'

class SchemaBoolean extends Component {
	constructor(props) {
		super(props)
		this.state = this.props.data
	}

	componentWillReceiveProps(nextProps) {
		this.setState(nextProps.data)
	}

	export() {
		return {
			type: 'boolean',
			format: 'checkbox'
		}
	}
	
	render() {
		return (
			<div></div>
		)
	}
}

export default SchemaBoolean