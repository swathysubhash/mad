import Inferno from 'inferno'
import Component from 'inferno-component'
import { createApi } from '../../actions/api'


class ApiList extends Component {
	constructor(props){
		super(props)
		this.createApiOnClick = this.createApiOnClick.bind(this)
		this.state = {
			form : {
				name: "testapi-f2"
			}
		}
	}

	createApiOnClick(event) {
		event.preventDefault()

		const store = this.context.store
		const state = store.getState()

		store.dispatch({ type: 'CREATE_API_REQUEST' })
		createApi(this.state.form).then((err, res) => {
			if (err) {
				store.dispatch({ type: 'CREATE_API_FAILURE', data: err})
			} else {
				store.dispatch({ type: 'CREATE_API_SUCCESS', data: res.body})
			}			
		})

	}


	render() {
		const state = this.context.store.getState()
		return (
			<div>
				<div>ApiList</div>
				<button onClick={ this.createApiOnClick }>New</button>
			</div>
		);
	}
}

export default ApiList