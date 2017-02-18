import './index.less'

import Inferno from 'inferno'
import Component from 'inferno-component'
import ApiForm from '../api_form/index'
import Tab from '../../components/tab'
import { Link } from 'inferno-router'
import { connect } from 'inferno-redux'
import { getApi } from '../../actions/api'
//<Tab 
	//						children = {this.props.children.map(child => 
	//							Inferno.cloneVNode(child, { link: currentLink + child.props.path }))}	/>
class Documents extends Component {
	constructor(props){
		super(props)
		if (this.props.children) {
			this.state = {
				denied: false,
				tabs: ['Editor', 'Style', 'Access', 'Revision', 'Settings'],
				selectedTab: this.props.children.props.title
			}	
		}
		this.tabClick = this.tabClick.bind(this)
	}

	componentDidMount() {
		const store = this.context.store
		const state = store.getState()

		// let apis = state.entities.apis.byIds
		// let apiId = this.props.params.documentId
		// let api = apis[apiId]

		// if (api && !api.currentRevision) {
			let apiId = this.props.params.documentId
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
		// }
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
								<span><i className="fa fa-angle-right" aria-hidden="true"></i></span>
							</Link>
							{ api && api.name ? <span>{api.name}</span> : <span></span> }
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


export default Documents