import './form_input.less'
import Inferno from 'inferno'
import Component from 'inferno-component'

class FormInput extends Component {
	constructor(props){
		super(props)

		this.state = {
			fieldData: this.props.data,
			placeholder: this.props.placeholder,
			label: this.props.label,
			type: this.props.type || 'input',
			validate: this.props.validate,
		}
	}
	render() {
			let d = this.state.fieldData()
			let formClass = `form-input ${d.error ? 'error': ''}`
			return (
						<div className={formClass}>
							<div className="label">
								<span>{this.state.label}</span>
							</div>
							<div>
								{
									this.state.type === 'textarea' ?
									<textarea onBlur={this.props.validate} placeholder={this.state.placeholder}>
										{d.value}
									</textarea>
									:this.state.type === 'checkbox' ?
									<input type="checkbox" onChange={this.props.validate} checked={d.value}>
										{d.label}
									</input>
									:
									<input type="text" onBlur={this.props.validate} placeholder={this.state.placeholder} value={d.value}>
										{d.value}
									</input>
								}
							</div>
							<div className="error-message">
								<span>{d.error ? d.errorMessage : ''}</span>
							</div>
						</div>
					)
	}
}


export default FormInput