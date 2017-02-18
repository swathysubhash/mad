import Inferno from 'inferno'
import Component from 'inferno-component'

class Notification extends Component {
	constructor(props) {
		super(props)
	}

	componentWillMount(props) {

	}

	componentDidMount(props) {
		window.setTimeout(() => {
			this.context.store.dispatch({type: 'DISMISS_NOTIFICATION', data: this.props.data})	
		}, 3000)
	}

	render() {
		return (
			<div>
				<div className={"notification " + this.props.data.type}>{this.props.data.message}</div>
			</div>
		);
	}
}

export default Notification