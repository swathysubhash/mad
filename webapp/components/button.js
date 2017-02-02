import Inferno from 'inferno'
import Component from 'inferno-component'

class Button extends Component {
	constructor(props){
		super(props)
		this.onClick = this.onClick.bind(this)
	}

	onClick(event) {
		event.stopPropagation()
		if (this.props.action === 'submit') {
			this.props.onSubmit && this.props.onSubmit();
		}
		this.props.onClick && this.props.onClick();
	}

	render() {
			return (
					<div>
						<button className={this.props.action} onClick={this.onClick}>
							<span>{this.props.text}</span>
							{this.props.loading ? <span>...</span> : <span></span>}
						</button>
					</div>
				)
	}
}


export default Button