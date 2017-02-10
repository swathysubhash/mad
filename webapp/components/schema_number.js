import Inferno from 'inferno'
import Component from 'inferno-component'

class SchemaNumber extends Component {
	constructor(props) {
		super(props)
		this.state = this.props.data
		this.change = this.change.bind(this)
	}
	
	componentWillReceiveProps(nextProps) {
		this.setState(nextProps.data)
	}

	change(event) {
		this.state[event.target.name] = event.target.value
		this.setState(this.state)
		this.props.onChange(this.state)
	}

	export() {
		var o = JSON.parse(JSON.stringify(this.state));
		o.type = 'number'
		delete o.name
		return o
	}

	render() {
		let shortNumberStyle = {
			width: '50px'
		}
		return (
			<div>
				Min: <input name="minimum" style={shortNumberStyle} type="number" value={this.state.minimum} onInput={this.change} />
				Max: <input name="maximum" style={shortNumberStyle} type="number" value={this.state.maximum} onInput={this.change} />
			</div>
		);
	}
}

export default SchemaNumber