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
			return (
						<div>
							<div>
								<span>{this.state.label}</span>
							</div>
							<div>
								{
									this.state.type === 'textarea' ?
									<textarea onBlur={this.props.validate} placeholder={this.state.placeholder}>
										{d.value}
									</textarea>
									:
									<input type="text" onBlur={this.props.validate} placeholder={this.state.placeholder}>
										{d.value}
									</input>
								}
							</div>
							<div>
								<span>{d.error ? d.errorMessage : ''}</span>
							</div>
						</div>
					)
	}
}


export default FormInput