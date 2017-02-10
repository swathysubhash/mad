import './index.less'

import Inferno from 'inferno'
import Component from 'inferno-component'
import ApiForm from '../api_form/index'
import Tab from '../../components/tab'
import { getApi } from '../../actions/api'
//<Tab 
	//						children = {this.props.children.map(child => 
	//							Inferno.cloneVNode(child, { link: currentLink + child.props.path }))}	/>
class Documents extends Component {
	constructor(props){
		super(props)
		if (this.props.children) {
			this.state = {
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
			store.dispatch({ type: 'GET_API_REQUEST'})
			getApi({ apiId: this.props.params.documentId })
			.then(res => store.dispatch({ type: 'GET_API_RESPONSE', data: res.data}))
			.catch(err => store.dispatch({ type: 'GET_API_FAILURE', data: err.response.data}))		
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
		return (
			<div>
				<div>DocumentsIndex</div>
				{
					<div>
						<div class="tab-group">
							{this.state.tabs.map(tab => 
								<div 
									onClick={this.tabClick.bind(this, tab)} 
									className={this.state.selectedTab === tab ? 'selected tab': 'tab'}>
									{tab}
								</div>)}
						</div>
						<div className="tabs">
	          	{this.props.children}
	        	</div>
	        </div>
      }
			</div>
		);
	}
}

export default Documents