import Inferno from 'inferno'
import Component from 'inferno-component'
import { renderMarkdown } from '../helpers/util'
import MarkdownEditor from './markdown_editor'

class SchemaString extends Component {
	constructor(props) {
		super(props)
		this.state = this.props.data
		this.change = this.change.bind(this)
		this.changeBool = this.changeBool.bind(this)
		this.changeEnum = this.changeEnum.bind(this)
		this.descriptionChange = this.descriptionChange.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		this.setState(nextProps.data)
	}

	export() {
		return {
			type: 'string',
			format: this.state.format,
			pattern: !!this.state.pattern ? this.state.pattern : undefined,
			enum: this.state.enum
		}
	}

	change(event) {
		this.state[event.target.name] = event.target.value;
		this.setState(this.state);
		this.props.onChange && this.props.onChange(this.state)
	}

	changeBool(event) {
		this.state[event.target.name] = event.target.checked
		this.setState(this.state)
		this.props.onChange && this.props.onChange(this.state)
	}

	changeEnum(event) {
		var arr = event.target.value.split('\n')
		if (arr.length == 1 && !arr[0]) {
			arr = undefined;
		}
		this.state[event.target.name] = arr
		this.setState(this.state)
		this.props.onChange && this.props.onChange(this.state)
	}

	descriptionChange(value) {
	this.state['description'] = value
	this.state['descriptionHTML'] = renderMarkdown(value)
	this.setState(this.state)
	this.props.onChange && this.props.onChange(this.state)
}


	render() {
		var settings;
		if (this.state.hasEnum) {
			settings = <div>
						<label style={{display: 'block'}} htmlFor="enum">Enum (one value per line):</label>
						<textarea onChange={this.changeEnum} name="enum" value={(this.state.enum||[]).join('\n')} />
					  </div>
		} else {
			settings = <span>
				Pattern: <input name="pattern" type="text" value={this.state.pattern} onInput={this.change} />
				</span>
		}
		return (
			<div>
				<div className={"schema-field"}>
					<div><span className={"label description"}>Description: </span><MarkdownEditor onChange={this.descriptionChange} path={this.props.name} options={{toolbar: false, status: false}} value={this.state.description} defaultValue={this.state.description}/></div>
					{settings}
				</div>
			</div>
		);
	}
}

export default SchemaString