import Inferno from 'inferno'
import Component from 'inferno-component'

import SchemaArray from './schema_array'
import SchemaNumber from './schema_number'
import SchemaString from './schema_string'
import SchemaBoolean from './schema_boolean'
import { renderMarkdown } from '../helpers/util'
import MarkdownEditor from './markdown_editor'

class SchemaObject extends Component {
	constructor(props) {
		super(props)
		this.state = this.propsToState(props)
		this.sref = []
		this.add = this.add.bind(this)
		this.changeItem = this.changeItem.bind(this)
		this.onPropsChange = this.onPropsChange.bind(this)
		this.descriptionChange = this.descriptionChange.bind(this)
		// this.onChange = this.onChange.bind(this)
		this.changeRequired = this.changeRequired.bind(this)
		this.deleteItem = this.deleteItem.bind(this)
	}

	propsToState(props) {
		let data = props.data
		data.properties = data.properties || []
		// data.required = data.required || []
		// data.propertyNames = []
		// data.properties = Object.keys(data.properties).map(name => {
		// 	data.propertyNames.push(name)
		// 	return data.properties[name]
		// })
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
			// this.state.propertyNames[i] = event.target.value
			this.state.properties[i].name = event.target.value
		}
		this.setStateSync(this.state)
		this.props.onChange && this.props.onChange(this.state)
	}

	deleteItem(index) {
		// let i = event.target.parentElement.dataset.index
		// let requiredIndex = this.state.required.indexOf(this.state.propertyNames[i])
		// if (index !== -1) {
			this.state.properties.splice(index, 1)
		// }
		// this.state.properties.splice(i, 1)
		// this.state.propertyNames.splice(i, 1)
		this.setStateSync(this.state)
		this.props.onChange && this.props.onChange(this.state)
	}

	changeRequired(index) {
		if (event.target.checked)
			// this.state.required.push(event.target.name);
		this.state.properties[index].required = true
		else {
			// var i = this.state.required.indexOf(event.target.name)
			// this.state.required.splice(i, 1)
			this.state.properties[index].required = false
		}
		this.setStateSync(this.state)
		this.props.onChange && this.props.onChange(this.state)
	}

	onPropsChange(index, state) {
		this.state.properties[index] = { ...this.state.properties[index], ...state }
		this.setStateSync(this.state)
		this.props.onChange && this.props.onChange(this.state)
	}


	descriptionChange(value) {
		this.state['description'] = value
		this.state['descriptionHTML'] = renderMarkdown(value)
		this.setState(this.state)
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
		// var properties = {};
		// Object.keys(this.state.properties.forEach(index => {
		// 	let name = this.state.propertyNames[index];
		// 	if (name && typeof this.sref['item'+index] != 'undefined' && name.length > 0)
		// 		properties[name] = this.sref['item'+index].export();
		// });
		return {
			type: 'object',
			format: this.state.format,
			description: this.state.description,
			descriptionHTML: this.state.descriptionHTML,
			properties: this.state.properties,
			// required: this.state.required.length ? this.state.required : undefined
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
		var typeSelectStyle = {
			marginLeft: '5px'
		}
		return (
			<div className={"schema-object"}>
				<div><span className={"label description"}>Description: </span><MarkdownEditor onChange={this.descriptionChange} path={this.props.name} options={{toolbar: false, status: false}} value={this.state.description} defaultValue={this.state.description}/></div>
				{
					this.state.properties.map((property, index) => {
						let name = property.name
						let optionForm = this.mapping('item' + index, property, this.onPropsChange.bind(this, index));
						return <div data-index={index} style={fieldStyle} key={index}>
							<input name={"field"} type={"string"} placeholder={"field name"} onInput={this.changeItem} value={name} />
							<select style={typeSelectStyle} name={"type"} onChange={this.changeItem} value={property.type}>
								<option value={"string"}>string</option>
								<option value={"number"}>number</option>
								<option value={"array"}>array</option>
								<option value={"object"}>object</option>
								<option value={"boolean"}>boolean</option>
							</select>
							<span style={requiredIcon}>*</span><input name={name} type="checkbox" onClick={this.changeRequired.bind(this,index)} checked={!!property.required} />
							<span onClick={this.deleteItem.bind(this, index)} className={"delete"}>Delete</span>
							<div style={optionFormStyle}>
								{optionForm}
							</div>
						</div>
					})
				}
				<button onClick={this.add} className={"add-another"}>Add another field</button>
			</div>
		)
	}

}

export default SchemaObject