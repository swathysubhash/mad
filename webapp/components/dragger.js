import './dragger.less'
import Inferno from 'inferno'
import Component from 'inferno-component'
import dragula from 'dragula'

class Dragger extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<div ref={(handle) => { this.handle = handle }}>
				{this.props.children}
			</div>
		)
	}
}