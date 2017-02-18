import Inferno from 'inferno'
import Component from 'inferno-component'
import { renderMarkdown } from '../helpers/util'
import MarkdownEditor from './markdown_editor'


class SchemaBoolean extends Component {
	constructor(props) {
		super(props)
		this.state = this.props.data
		this.descriptionChange = this.descriptionChange.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		this.setState(nextProps.data)
	}


	descriptionChange(value) {
		this.state['description'] = value
		this.state['descriptionHTML'] = renderMarkdown(value)
		this.setState(this.state)
		this.props.onChange && this.props.onChange(this.state)
	}


	export() {
		return {
			type: 'boolean',
			format: 'checkbox'
		}
	}
	
	render() {
		return (
			<div>
				<div><span className={"label description"}>Description: </span><MarkdownEditor onChange={this.descriptionChange} path={this.props.name} options={{toolbar: false, status: false}} value={this.state.description} defaultValue={this.state.description}/></div>
			</div>
		)
	}
}

export default SchemaBoolean