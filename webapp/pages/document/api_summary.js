import Inferno from 'inferno'
import Component from 'inferno-component'
import { connect } from 'inferno-redux';
import { getApiSummary } from '../../actions/api'
import GroupRow from './group_row'


class ApiSummary extends Component {
	constructor(props){
		super(props)
	}

	fetchApiSummary(apiId) {
		const store = this.context.store
		const state = store.getState()

		store.dispatch({ type: 'GET_APISUMMARY_REQUEST'})
		getApiSummary({ apiId })
		.then(res => store.dispatch({ type: 'GET_APISUMMARY_RESPONSE', data: res.data}))
		.catch(err => store.dispatch({ type: 'GET_APISUMMARY_FAILURE', data: err.response.data}))		
	}

	componentDidMount() {
		this.fetchApiSummary(this.props.api.id || this.props.documentId)
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.apiSummary.stale === true) {
			this.fetchApiSummary(nextProps.documentId)
		}
	}

	render() {
		// const state = this.context.store.getState()
		const api = this.props.api
		if(!api) {

		} else {
			return (
				<div>
					<div>ApiSummary</div>
					{this.props.apiSummary.loading ? <div>Loading true</div> : <div>Loading false</div>}
					{api.groupIds && api.groupIds.map( g => <GroupRow selected={this.props.apiSummary.selected} gId={g} apiId={api.id}/>)}
				</div>
			);	
		}
		
	}
}

function mapStateToProps(state, ownProps) {
	let api = state.entities.apis.byIds[ownProps.documentId] || {}
	return {
		api,
		apiSummary: state.entities.ui.apiSummary,
		groups: state.entities.groups.byIds,
	}
} 

export default connect(mapStateToProps)(ApiSummary)