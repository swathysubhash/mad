import Inferno from 'inferno'
import Component from 'inferno-component'

class ButtonMenuItem extends Component {
	constructor(props){
		super(props)
		this.onClick = this.onClick.bind(this)
	}

	onClick(event) {
		event.stopPropagation()
		this.props.closeMenu(true)
		this.props.onClick && this.props.onClick(event)
	}

	render() {
		return (
			<div className="button-menu-item">
				<button onClick={this.onClick}>{this.props.text}</button>
			</div>
		)
	}
}

export default ButtonMenuItem