import Inferno, { linkEvent } from 'inferno'
import Component from 'inferno-component'

class Tab extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<div>{this.props.children.map(child => <div>{child.link}</div>)}</div>
		)
	}
}

export default Tab