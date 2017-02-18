import Inferno from 'inferno'
import Component from 'inferno-component'
import { renderMarkdown } from '../helpers/util'
import MarkdownEditor from './markdown_editor'

class SchemaNumber extends Component {
	constructor(props) {
		super(props)
		this.state = this.props.data
		this.change = this.change.bind(this)
		this.descriptionChange = this.descriptionChange.bind(this)
	}
	
	componentWillReceiveProps(nextProps) {
		this.setState(nextProps.data)
	}

	change(event) {
		this.state[event.target.name] = event.target.value
		this.setState(this.state)
		this.props.onChange(this.state)
	}

	descriptionChange(value) {
		this.state['description'] = value
		this.state['descriptionHTML'] = renderMarkdown(value)
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
			<div class="schema-field">
				<div><span className={"label description"}>Description: </span><MarkdownEditor onChange={this.descriptionChange} path={this.props.name} options={{toolbar: false, status: false}} value={this.state.description} defaultValue={this.state.description}/></div>
				<div><span className={"label"}>Min: </span><input name="minimum" style={shortNumberStyle} type="number" value={this.state.minimum} onInput={this.change} /></div>
				<div><span className={"label"}>Max: </span><input name="maximum" style={shortNumberStyle} type="number" value={this.state.maximum} onInput={this.change} /></div>
			</div>
		);
	}
}

export default SchemaNumber