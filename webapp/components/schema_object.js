import Inferno from 'inferno'
import Component from 'inferno-component'

import SchemaArray from './schema_array'
import SchemaNumber from './schema_number'
import SchemaString from './schema_string'
import SchemaBoolean from './schema_boolean'

class SchemaObject extends Component {
	constructor(props) {
		super(props)
		this.state = this.propsToState(props)
		this.sref = []
		this.add = this.add.bind(this)
		this.changeItem = this.changeItem.bind(this)
		this.onPropsChange = this.onPropsChange.bind(this)
		// this.onChange = this.onChange.bind(this)
		this.changeRequired = this.changeRequired.bind(this)
		this.deleteItem = this.deleteItem.bind(this)
	}

	propsToState(props) {
		let data = props.data
		data.properties = data.properties || {}
		data.required = data.required || []
		data.propertyNames = []
		data.properties = Object.keys(data.properties).map(name => {
			data.propertyNames.push(name)
			return data.properties[name]
		})
		return data
	}

	componentWillReceiveProps(nextProps) {
		this.setState(this.propsToState(nextProps))
	}

	mapping(name, data, changeHandler) {
		return {
			string: <SchemaString onChange={changeHandler} ref={(sref) => { this.sref[name] = sref }} data={data} />,
			number: <SchemaNumber onChange={changeHandler} ref={(sref) => { this.sref[name] = sref }} data={data} />,
			array: <SchemaArray onChange={changeHandler} ref={(sref) => { this.sref[name] = sref }} data={data}/>,
			object: <SchemaObject onChange={changeHandler} ref={(sref) => { this.sref[name] = sref }} data={data}/>,
			boolean: <SchemaBoolean onChange={changeHandler} ref={(sref) => { this.sref[name] = sref }} data={data}/>,
		}[data.type]
	}

	changeItem() {
		let i = event.target.parentElement.dataset.index
		if (event.target.name == 'type') {
			this.state.properties[i].type = event.target.value
		} else if (event.target.name == 'field') {
			this.state.propertyNames[i] = event.target.value
		}
		this.setStateSync(this.state)
		this.props.onChange && this.props.onChange(this.state)
	}

	deleteItem() {
		let i = event.target.parentElement.dataset.index
		let requiredIndex = this.state.required.indexOf(this.state.propertyNames[i])
		if (requiredIndex !== -1) {
			this.state.required.splice(requiredIndex, 1)
		}
		this.state.properties.splice(i, 1)
		this.state.propertyNames.splice(i, 1)
		this.setStateSync(this.state)
		this.props.onChange && this.props.onChange(this.state)
	}

	changeRequired() {
		if (event.target.checked)
			this.state.required.push(event.target.name);
		else {
			var i = this.state.required.indexOf(event.target.name)
			this.state.required.splice(i, 1)
		}
		this.setStateSync(this.state)
		this.props.onChange && this.props.onChange(this.state)
	}

	onPropsChange(index, state) {
		this.state.properties[index] = { ...this.state.properties[index], ...state }
		this.setStateSync(this.state)
		this.props.onChange && this.props.onChange(this.state)
	}

	// onChange() {
	// 	this.props.onChange(this.state)
	// }

	// componentDidUpdate() {
	// 	this.onChange();
	// }

	add() {
		this.state.properties.push({name: '', type: 'string'})
		this.setStateSync(this.state)
		this.props.onChange && this.props.onChange(this.state) 
	}

	export() {
		var properties = {};
		Object.keys(this.state.properties).forEach(index => {
			let name = this.state.propertyNames[index];
			if (name && typeof this.sref['item'+index] != 'undefined' && name.length > 0)
				properties[name] = this.sref['item'+index].export();
		});
		return {
			type: 'object',
			format: this.state.format,
			properties: properties,
			required: this.state.required.length ? this.state.required : undefined
		}
	}



	render() {
		var optionFormStyle = {
			paddingLeft: '25px',
			paddingTop: '4px',
		};
		var requiredIcon = {
			fontSize: '1em',
			color: 'red',
			fontWeight: 'bold',
			paddingLeft: '5px'
		};
		var fieldStyle = {
			paddingBottom: '10px',
		}
		var objectStyle = {
			borderLeft: '2px dotted gray',
			paddingLeft: '8px',
			paddingTop: '10px',
		}
		var typeSelectStyle = {
			marginLeft: '5px'
		}
		var deletePropStyle = {
			border: '1px solid black',
			padding: '0px 4px 0px 4px',
			pointer: 'cursor',
		}

		return (
			<div style={objectStyle}>
				{
					this.state.properties.map((value, index) => {
						let name = this.state.propertyNames[index]
						let copiedState = JSON.parse(JSON.stringify(this.state.properties[index]))
						let optionForm = this.mapping('item' + index, copiedState, this.onPropsChange.bind(this, index));
						return <div data-index={index} style={fieldStyle} key={index}>
							<input name="field" type="string" onInput={this.changeItem} value={name} />
							<select style={typeSelectStyle} name="type" onChange={this.changeItem} value={value.type}>
								<option value="string">string</option>
								<option value="number">number</option>
								<option value="array">array</option>
								<option value="object">object</option>
								<option value="boolean">boolean</option>
							</select>
							<span style={requiredIcon}>*</span><input name={name} type="checkbox" onClick={this.changeRequired} checked={this.state.required.indexOf(name) != -1} />
							<span onClick={this.deleteItem} style={deletePropStyle}>x</span>
							<div style={optionFormStyle}>
								{optionForm}
							</div>
						</div>
					})
				}
				<button onClick={this.add}>Add another field</button>
			</div>
		)
	}

}

export default SchemaObject