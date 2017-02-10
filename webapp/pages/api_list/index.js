import Inferno from 'inferno'
import Component from 'inferno-component'
import { getApiList } from '../../actions/api'
import ApiForm from '../api_form'
import { connect } from 'inferno-redux'


class ApiList extends Component {
	constructor(props){
		super(props)
		this.onApiRowClick = this.onApiRowClick.bind(this)
		this.createApiOnClick = this.createApiOnClick.bind(this)
	}

	onApiRowClick(apiId, event) {
		this.context.router.push('/documents/' + apiId + '/editor')
	}

	createApiOnClick(){
		this.context.router.push('/documentlist/create')	
	}

	componentDidMount() {
		const store = this.context.store
		const state = store.getState()
		getApiList()
		.then(res => store.dispatch({ type: 'GET_APILIST_SUCCESS', data: res.data}))
		.catch(err => store.dispatch({ type: 'GET_APILIST_FAILURE', data: err.response.data}))
	}

	render() {
		const state = this.context.store.getState()
		const apis = state.entities.apis.byIds
		const apiIds = Object.keys(apis)
		return (
			<div>
				<div>ApiList</div>
				<button onClick={ this.createApiOnClick }>New</button>
				{apiIds.map(id => <div onClick={this.onApiRowClick.bind(this, id)}>{apis[id].name}</div>)}
				{this.props.children}
			</div>
		);
	}
}

export default connect(() => {})(ApiList)