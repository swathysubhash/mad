import Inferno from 'inferno'
import Component from 'inferno-component'
import Header from '../header'



class Page extends Component {
	render() {
		return (
			<div>
				<div className="header"><Header /></div>
				<div className="content">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default Page