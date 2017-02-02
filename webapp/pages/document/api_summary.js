import Inferno from 'inferno'
import Component from 'inferno-component'
import { connect } from 'inferno-redux';
import { getApiSummary } from '../../actions/api'
import GroupRow from './group_row'


class ApiSummary extends Component {
	constructor(props){
		super(props)
	}

	componentDidMount() {
		const store = this.context.store
		const state = store.getState()

		store.dispatch({ type: 'GET_APISUMMARY_REQUEST'})
		getApiSummary({ apiId:  this.props.documentId})
		.then(res => store.dispatch({ type: 'GET_APISUMMARY_RESPONSE', data: res.data}))
		.catch(err => store.dispatch({ type: 'GET_APISUMMARY_FAILURE', data: err.response.data}))		
		
	}

	render() {
		const state = this.context.store.getState()
		const api = state.entities.apis.byIds[this.props.documentId]
		if(!api) {

		} else {
			return (
				<div>
					<div>ApiSummary</div>
					{state.entities.ui.apiSummary.loading ? <div>Loading true</div> : <div>Loading false</div>}
					{api.groupIds && api.groupIds.map( g => <GroupRow gId={g} apiId={this.props.documentId}/>)}
				</div>
			);	
		}
		
	}
}

export default connect(() => {})(ApiSummary)