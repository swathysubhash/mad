import Inferno from 'inferno'
import Component from 'inferno-component'

class FormButton extends Component {
	constructor(props){
		super(props)

		this.state = {
			type: this.props.type || 'primary',
			loading: this.props.loading || (() => false),
			text: this.props.text,
			onClick: this.props.onClick,
		}
	}
	render() {
			return (
					<div>
						<button className={this.state.type} onClick={this.props.onClick}>
							<span>{this.state.text}</span>
							{this.state.loading() ? <span>...</span> : <span></span>}
						</button>
					</div>
				)
	}
}


export default FormButton