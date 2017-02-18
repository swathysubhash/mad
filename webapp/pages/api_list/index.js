import './index.less'

import Inferno from 'inferno'
import Component from 'inferno-component'
import { Link } from 'inferno-router'
import { getApiList } from '../../actions/api'
import ApiForm from '../api_form'
import { convertEpoch } from '../../helpers/util'
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
				<div class="context">
					<div class="middle">
						<div>
							<Link className="bread-el" to={"/"}>
							<span>Api Document List</span>
							</Link>
						</div>
					</div>
				</div>
				<div className={"middle api-list"} >
					<div className={"left"}>
						<button onClick={ this.createApiOnClick }><i class="fa fa-plus" aria-hidden="true"></i>Create Api Document</button>
					</div>
					<div className={"right"}>
						<div className={"form-header"}>Api Document List</div>
						<div className={"api-list"}>
							<div className={"api-row-header"}>
								<div></div>
								<div className={"col7"}>Name</div>
								<div className={"col2"}>Updated At</div>
								<div className={"col3"}>Updated By</div>
							</div>
							{apiIds.map(id => <div className={"api-row"} onClick={this.onApiRowClick.bind(this, id)}>
								<div className={"file"}><i class="fa fa-file-text-o" aria-hidden="true"></i></div><div className={"col7"}><div>{apis[id].name}</div><div className={"sub-detail"}>Version: <span>{apis[id].version}</span>  Revision: <span>{apis[id].currentRevision}</span></div></div>
								<div className={"col2"}>{convertEpoch(apis[id].updatedAt)}</div>
								<div className={"col2"}>{apis[id].updatedBy}</div>
								</div>)}
						</div>
					</div>
				</div>
				{this.props.children}
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		...state,
		...ownProps
	}
}

export default connect(mapStateToProps)(ApiList)