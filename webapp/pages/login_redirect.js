import Inferno from 'inferno'
import Component from 'inferno-component'

class LoginRedirect extends Component {
	constructor(props) {
		super(props)
	}
	componentDidMount() {
		window.location = '/login'
	}
	render(){}
}

export default LoginRedirect