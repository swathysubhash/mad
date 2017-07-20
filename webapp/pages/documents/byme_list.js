import Inferno from 'inferno'
import Component from 'inferno-component'
import { Link } from 'inferno-router'
import { getApiListByMe } from '../../actions/api'
import ApiForm from '../api_form/index'
import { convertEpoch } from '../../helpers/util'
import { connect } from 'inferno-redux'


class ByMeList extends Component {
	constructor(props){
		super(props)
		this.state = {
			loading: false,
			items : [],
			pagination: {
				next : '',
				previous: ''
			}
		}
		this.onApiRowClick = this.onApiRowClick.bind(this)
		this.prevOnClick = this.prevOnClick.bind(this)
		this.nextOnClick = this.nextOnClick.bind(this)
	}

	onApiRowClick(apiId, event) {
		this.context.router.push('/documents/' + apiId + '/editor')
	}

	prevOnClick() {
		this.fetchApis(this.state.pagination.previous)
	}

	nextOnClick() {
		this.fetchApis(this.state.pagination.next)
	}

	fetchApis(url) {
		const store = this.context.store
		this.setState({ loading: true })
		getApiListByMe(url)
		.then(res => {
			this.setState({
				loading: false,
				items: res.data.data,
				pagination: res.data.pagination
			})
			store.dispatch({ type: 'GET_APILIST_SUCCESS', data: res.data})
		})
		.catch(err => store.dispatch({ type: 'GET_APILIST_FAILURE', data: err.response.data}))
	}

	componentDidMount() {
		this.fetchApis()
	}

	render() {
		const state = this.context.store.getState()
		const documents = this.state.items
		return (
			<div>
				<div className={"form-header"}>Created by you</div>
				<div className={"page-buttons"}>
						{ this.state.pagination.previous ? <button onClick={this.prevOnClick}>Prev</button> : '' }
						{ this.state.pagination.next ? <button onClick={this.nextOnClick}>Next</button> : '' }
				</div>
				<div className={"api-list"}>
					{documents.map(doc => <div className={"api-row"} onClick={this.onApiRowClick.bind(this, doc.id)}>
						<div className={"file"}>
							<span className={"fa fa-file-text-o"} aria-hidden="true"></span>
						</div>
						<div className={"col5"}>
							<div className={"name"}>{doc.name}</div>
							<div className={"sub-detail"}>Version: 
								<span>{doc.version}</span>  Revision: <span>{doc.currentRevision}</span>
							</div>
							<div className={"last-update"}>Last updated at {convertEpoch(doc.updatedAt)}</div>	
						</div>
						<div className={"updated-by"}>{doc.updatedBy}</div>
						<div className={"col2"}>{
							doc.publishedRevision === -1 ? 
							<span style="font-weight: 300;">Not published</span> 
							: <a onClick={() => this.stopPropagation()} href={"/docs/" + doc.slug} target="_blank">
									<button class="list-btn-preview">View docs</button>
								</a>
						}</div>
						</div>)}
					<div>
						{documents && documents.length == 0 ? <div>You have not created any documents. Try adding one.</div> : ""}
					</div>
				</div>
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

export default connect(mapStateToProps)(ByMeList)