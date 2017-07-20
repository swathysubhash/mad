import './index.less'

import Inferno from 'inferno'
import Component from 'inferno-component'
import ApiForm from '../api_form/index'
import Tab from '../../components/tab'
import { Link } from 'inferno-router'
import { connect } from 'inferno-redux'
import { getApi, publishApi } from '../../actions/api'
//<Tab 
	//						children = {this.props.children.map(child => 
	//							Inferno.cloneVNode(child, { link: currentLink + child.props.path }))}	/>
class Documents extends Component {
	constructor(props){
		super(props)
		if (this.props.children) {
			this.state = {
				denied: false,
				tabs: ['Editor', 'Style', 'Access', 'Settings'],
				selectedTab: this.props.children.props.title,
				publishing: false,
			}	
		}
		this.tabClick = this.tabClick.bind(this)
		this.publishOnClick = this.publishOnClick.bind(this)
	}

	fetchApi(apiId) {
		const store = this.context.store
		const state = store.getState()
		store.dispatch({ type: 'GET_API_REQUEST'})
		getApi({ apiId })
		.then(res => store.dispatch({ type: 'GET_API_RESPONSE', data: res.data}))
		.catch(err => {
			if (err.response.status === 403) {
				this.setState({ denied: true })
			} else {
				store.dispatch({ type: 'GET_API_FAILURE', data: err.response.data})	
			}
		})
	}

	componentDidMount() {
		this.fetchApi(this.props.params.documentId)
	}

	componentWillReceiveProps(nextProps) {
		let title = nextProps.children.props.title
		if (this.props.children.props.title !== title) {
			this.setState({
				selectedTab: title
			})
		}
	}

	tabClick(path) {
		let currentLink = '/documents/' + this.props.params.documentId + '/'
		this.context.router.push(currentLink + path.toLowerCase())
	}

	publishOnClick() {
		let apiId = this.props.params.documentId
		const store = this.context.store
		if (this.state.publishing === true) {
			return
		}
		this.setStateSync({ publishing: true })
		publishApi({ apiId })
			.then(res => {
				store.dispatch({ type: 'RESET_API_SUMMARY'}) // Setting api summary to stale
				store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'success', message: 'Published successfully.' }})
				this.fetchApi(apiId)
				this.tabClick('editor')
				this.setStateSync({ publishing: false })
			})
			.catch(err => {
				this.tabClick('editor')
				store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'danger', message: 'publish api failed' }	})
				this.setStateSync({ publishing: false })
			})
	}

	render() {
		const store = this.context.store
		const state = store.getState()
		let apis = state.entities.apis.byIds
		let apiId = this.props.params.documentId
		let api = apis[apiId]

		return (
			<div>
				<div className="context">
					<div className="middle">
						<div>
							<Link className="bread-el" to={"/"}>
								<span>Api Document List</span>
								<span className="fa fa-angle-right" aria-hidden="true"></span>
							</Link>
							{ api && api.name ? <span>{api.name}</span> : <span></span> }
							<span class="api-actions">
								{ api && api.slug ? <a href={"/docs/" + api.slug + "?c=1"} target="_blank">
									<button class="btn-preview">preview</button>
									</a> : "" }
								<button class="btn-publish" onClick={this.publishOnClick}>publish</button>
							</span>
						</div>
					</div>
				</div>
				{ this.state.denied && <div className="denied middle">You do not have access to this api document.</div> }
				{	!this.state.denied && <div>
						<div className={"tab-group"}>
							<div className={"middle"}>
								{this.state.tabs.map(tab => 
									<div 
										onClick={this.tabClick.bind(this, tab)} 
										className={this.state.selectedTab === tab ? 'selected tab': 'tab'}>
										{tab}
									</div>)}
							</div>
						</div>
						<div className={"tabs"}>
							<div className={"middle"}>
	          	{this.props.children}
	          	</div>
	        	</div>
	        </div>
      }
			</div>
		);
	}
}


function mapStateToProps(state, ownProps) {
	let apis = state.entities.apis.byIds
	let apiId = ownProps.params.documentId
	let api = apis[apiId]

	return {
		documentId: ownProps.params.documentId,
		slug: api && api.slug
	}
} 

export default connect(mapStateToProps)(Documents)