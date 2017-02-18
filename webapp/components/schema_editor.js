
import './schema_editor.less'
import Inferno from 'inferno'
import Component from 'inferno-component'
import SchemaObject from './schema_object'

class SchemaEditor extends Component {
	constructor(props) {
		super(props)
		this.onChange = this.onChange.bind(this)
	}

	onChange() {
		this.props.updateValue && this.props.updateValue(this.props.name, JSON.stringify(this.sref.export() || {}))
	}

	render() {
		let data = this.props.getValue(this.props.name)
		try {
			data = JSON.parse(data)
		} catch(e) {
			data = {}
			console.log("Error while parsing schema json")
		}
		return (
			<div className={"schema-editor"}>
			<label>Edit schema</label>
			<SchemaObject ref={(sref) => { this.sref = sref }} onChange={this.onChange} data={data} />
			</div>
		)
	}

}

export default SchemaEditor