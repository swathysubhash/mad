import Inferno from 'inferno'
import Component from 'inferno-component'
import SchemaObject from './schema_object'
import SchemaNumber from './schema_number'
import SchemaString from './schema_string'
import SchemaBoolean from './schema_boolean'

class SchemaArray extends Component {
	constructor(props) {
		super(props)
		this.state = this.props.data
		this.change = this.change.bind(this)
		this.onPropsChange = this.onPropsChange.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		this.setState(nextProps.data)
	}

	change(event) {
		if (event.target.type == 'checkbox') {
			this.state[event.target.name] = event.target.checked;
		} else if (event.target.name == 'itemtype') {
			this.state.items.type = event.target.value;
		} else {
			this.state[event.target.name] = event.target.value;
		}
		this.setStateSync(this.state);
		this.props.onChange && this.props.onChange(this.state)
	}

	onPropsChange(state) {
		this.state.items = { ...this.state.items, ...state }
		this.setStateSync(this.state)
		this.props.onChange && this.props.onChange(this.state)
	}

	export() {
		return {
			items: this.sref.export(),
			minItems: this.state.minItems,
			maxItems: this.state.maxItems,
			uniqueItems: (this.state.uniqueItems ? true : undefined),
			type: 'array'
		}
	}

	mapping(name, data, changeHandler) {
		return {
			string: <SchemaString onChange={changeHandler} ref={(sref) => { this.sref = sref }} data={data} />,
			number: <SchemaNumber onChange={changeHandler} ref={(sref) => { this.sref = sref }} data={data} />,
			array: <SchemaArray onChange={changeHandler} ref={(sref) => { this.sref = sref }} data={data}/>,
			object: <SchemaObject onChange={changeHandler} ref={(sref) => { this.sref = sref }} data={data}/>,
			boolean: <SchemaBoolean onChange={changeHandler} ref={(sref) => { this.sref = sref }} data={data}/>,
		}[data.type]
	}

	render() {
		let shortNumberStyle = {
			width: '50px'
		}
		var optionFormStyle = {
			paddingLeft: '25px',
			paddingTop: '4px',
		};
		this.state.items = this.state.items || {type: 'string'};
		var optionForm = this.mapping('items', this.state.items, this.onPropsChange);
		return (
			<div>
				Items Type:
				<select name="itemtype" onChange={this.change} value={this.state.items.type}>
						<option value="string">string</option>
						<option value="number">number</option>
						<option value="array">array</option>
						<option value="object">object</option>
						<option value="boolean">boolean</option>
					</select>
				minItems:  <input name="minItems" style={shortNumberStyle} type="number" onInput={this.change} value={this.state.minItems}  />
				maxItems:  <input name="maxItems" style={shortNumberStyle} type="number" onInput={this.change} value={this.state.maxItems}  />
				uniqueItems:  <input name="uniqueItems" type="checkbox" onInput={this.change} checked={this.state.uniqueItems}  />
				<div style={optionFormStyle}>
					{optionForm}
				</div>
			</div>
		);
	}
}

export default SchemaArray