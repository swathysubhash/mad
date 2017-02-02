import './button_menu.less'

import Inferno from 'inferno'
import Component from 'inferno-component'

class ButtonMenu extends Component {
	constructor(props){
		super(props)
		this.state = {
			itemsVisible: false
		}
		this.onClick = this.onClick.bind(this)
		this.closeMenu = this.closeMenu.bind(this)
		document.addEventListener('click', this.closeMenu)
	}

	onClick(event) {
		event.stopPropagation()
		this.setState({
			itemsVisible: !this.state.itemsVisible
		})
	}

	closeMenu(event) {
		if(this.buttonMenu && !this.buttonMenu.contains(event.target)) {
			this.setState({
				itemsVisible: false
			})
		}
	}

	render() {
		return (
				<div className="button-menu" ref={(menu) => { this.buttonMenu = menu; }}>
					<button onClick={this.onClick}>{this.props.text}</button>
					{this.state.itemsVisible ? 
						<div className="button-menu-items">
							{this.props.children.map(child => Inferno.cloneVNode(child, { closeMenu: this.closeMenu }))}
						</div> :
					''
					}
				</div>
			)
	}
}

export default ButtonMenu

