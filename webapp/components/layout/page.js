import './page.less'
import Inferno from 'inferno'
import Component from 'inferno-component'
import Header from '../header'
import { connect } from 'inferno-redux'
import Notification from '../notification'



class Page extends Component {
	constructor(props) {
		super(props)
	}

	componentWillReceiveProps() {

	}

	render() {
		return (
			<div>
				<div className="header"><Header /></div>
				<div className={"notifications"}>
					{ this.props.notifications.length ? this.props.notifications.map((n, i) =>
						<Notification data={n}></Notification>
					): "" }
				</div>
				<div className="content">
					{this.props.children}
				</div>
			</div>
		);
	}
}
function mapStateToProps(state, ownProps) {
	let notifications = state.entities.ui.notifications || []
	return {
		notifications
	}
} 

export default connect(mapStateToProps)(Page)