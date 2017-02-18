import './text.less'
import Inferno, { linkEvent } from 'inferno'
import Component from 'inferno-component'
import CodeMirror from './codemirror'
import MarkdownEditor from './markdown_editor'
import * as validators from '../helpers/validators'
import Dropdown from './dropdown'

class Text extends Component {
	constructor(props){
		super(props)
		this.state = {
			errors : []
		}
		this.onBlur = this.onBlur.bind(this)
		this.onChange = this.onChange.bind(this)
		this.onClick = this.onClick.bind(this)
		this.onCheckboxBlur = this.onCheckboxBlur.bind(this)
		this.codemirrorBlur = this.codemirrorBlur.bind(this)
		this.dropdownBlur = this.dropdownBlur.bind(this)
	}

	componentWillMount() {
		if (this.props.registerValidation) {
			this.removeValidationFromContext = this.props.registerValidation(show => this.isValid())
		}
  }

  componentWillUnmount() {
    this.removeValidationFromContext && this.removeValidationFromContext();
	}

	onClick() {
		this.props.onClick && this.props.onClick()
	}

	onCheckboxBlur(event) {
		event.stopPropagation()
		this.props.updateValue(this.props.name, !!event.target.checked)
	}

	codemirrorBlur(value) {
		this.props.updateValue(this.props.name, value)	
	}

	dropdownBlur({ label, value }) {
		this.props.updateValue(this.props.name, { label, value })	
		this.onClick()
	}

	onBlur(event) {
		event.stopPropagation()
		this.isValid(event.target.value);
	}

	onChange(event) {
		event.stopPropagation()
		this.props.updateValue(this.props.name, event.target.value)
	}

	isValid(value) {
		value = value || this.props.getValue(this.props.name)
		console.log('Checking', this.props.name, value)
		let errors = (this.props.validate || []).reduce((memo, currentName) => 
			memo.concat(validators[currentName](value)), []);
		this.setState({
			errors
		});

		this.props.updateErrors && this.props.updateErrors(errors[0])	
		return !errors.length
	}

	render() {
		let value = this.props.getValue && this.props.getValue(this.props.name)
		return (
			<div className={this.props.className ? this.props.className + " input-row" : "input-row"}>
				{this.props.labels !== false ? <div><label>{this.props.label}</label></div> : ''}
				<div>
					{this.props.type === 'textarea' ?
					<div>
					<MarkdownEditor 
							onChange={this.codemirrorBlur}
							path={this.props.name}
							options={this.props.options}
							value={this.props.getValue(this.props.name)}
							defaultValue={this.props.getValue(this.props.name)}
						/></div>
					: this.props.type === 'checkbox' ? 
						<div className={"switch"}>
							<input
							id={this.props.id + this.props.row}
							className={"input"}
							type={this.props.type}
							onClick={this.onCheckboxBlur}
							checked={this.props.getValue(this.props.name)}/>
							<label for={this.props.id + this.props.row} className={"slider"} />
						</div>
					: this.props.type === 'codemirror' ? 
						<CodeMirror 
							onChange={this.codemirrorBlur}
							path={this.props.name}
							defaultValue={this.props.getValue(this.props.name)} 
							options={{lineNumbers: true, mode: 'javascript'}}
						/>
					: this.props.type === 'dropdown' ? 
						<Dropdown
							options={this.props.options}
							placeholder={this.props.placeholder}
							onChange={this.dropdownBlur}
							value={value ? value : undefined}
							defaultValue={this.props.defaultOption}
						/>
					: this.props.type === 'color' ? 
						<div><input 
						type={"text"} 
						onClick={this.onClick}
						placeholder={this.props.placeholder} 
						onBlur={this.onBlur} 
						onInput={this.onChange}
						value={this.props.getValue(this.props.name)} /><span className={"color-box"} style={{"background": this.props.getValue(this.props.name)}}></span></div>
					:<input 
						type={this.props.type} 
						onClick={this.onClick}
						placeholder={this.props.placeholder} 
						onBlur={this.onBlur} 
						onInput={this.onChange}
						value={this.props.getValue(this.props.name)} />
					}
				</div>
				<div className={"error-label"}>{this.state.errors.length && this.props.showErrors !== false ? this.state.errors[0] : ''}</div>
			</div>
		)
	}
}

/*<textarea 
						type={this.props.type}
						onClick={this.onClick}
						placeholder={this.props.placeholder} 
						onBlur={this.onBlur}
						onInput={this.onChange} 
						defaultValue={this.props.getValue(this.props.name)}>{this.props.getValue(this.props.name)}
					</textarea>*/
export default Text