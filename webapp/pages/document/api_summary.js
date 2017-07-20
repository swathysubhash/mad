import './api_summary.less'

import Inferno from 'inferno'
import Component from 'inferno-component'
import { connect } from 'inferno-redux'
import { getApiSummary } from '../../actions/api'
import GroupRow from './group_row'
import dragula from 'dragula'


class ApiSummary extends Component {
	constructor(props){
		super(props)
		this.state = {
			loading: false
		}
	}

	fetchApiSummary(apiId) {
		const store = this.context.store
		const state = store.getState()
		this.setState({ loading: true })
		store.dispatch({ type: 'GET_APISUMMARY_REQUEST'})
		getApiSummary({ apiId })
		.then(res => {
			this.setState({ loading: false })
			store.dispatch({ type: 'GET_APISUMMARY_RESPONSE', data: res.data})
		})
		.catch(err => {
			this.setState({ loading: false })
			if (err.response.status !== 403) {
				store.dispatch({ type: 'GET_APISUMMARY_FAILURE', data: err.response.data})	
			}
		})		
	}

	componentDidMount() {
		this.fetchApiSummary(this.props.api.id || this.props.documentId)
		if (!this.groupHandle.dragHandler) {
			dragula([this.groupHandle], {
				moves: function (el, container, handle) {
    			return handle.classList.contains('group-select')
    		}
    	}).on('drop', (() => {
    		console.log(arguments)
    		console.log(arguments)
    	}).bind(this))
		}
		this.groupHandle.dragHandler = true
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.apiSummary.stale === true && (this.props.apiSummary.stale !== nextProps.apiSummary.stale)) {
			this.fetchApiSummary(nextProps.documentId)
		}
	}

	componentDidUpdate() {
		if (!this.groupHandle.dragHandler) {
			dragula([this.groupHandle], {
				moves: function (el, container, handle) {
    			return handle.classList.contains('group-select')
    		}
    	}).on('drop', (() => {
    		console.log(arguments)
    	}).bind(this))
		}
		this.groupHandle.dragHandler = true
	}

	render() {
		// const state = this.context.store.getState()
		const api = this.props.api
		if(!api) {

		} else {
			return (
				<div>
					<div className={"added-groups"}>
						<div>Added groups</div>
						<div className={"loader"}>{this.state.loading ? <i class="fa fa-spinner fa-spin" aria-hidden="true"></i> : ""}</div>
					</div>
					
					{/*{this.props.apiSummary.loading ? <div>Loading true</div> : <div>Loading false</div>}*/}
					<div ref={(handle) => { this.groupHandle = handle }}>
					{api.groupIds && api.groupIds.map((g, index) => <GroupRow selected={this.props.apiSummary.selected} gId={g} apiId={api.id} />)}
					</div>
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