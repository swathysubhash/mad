import Inferno from 'inferno'
import Component from 'inferno-component'
import { connect } from 'inferno-redux'
import ButtonMenu from '../../components/button_menu'
import ButtonMenuItem from '../../components/button_menu_item'
import { deleteEndpoint } from '../../actions/endpoint'


class EndpointRow extends Component {
	constructor(props){
		super(props)
		this.detail = this.detail.bind(this)
	}

	detail(subgroupType, event) {
		event.stopPropagation()
		this.context.store.dispatch({ type: 'ENDPOINT_SELECT', data: this.props.eId})
		this.context.router.push('/documents/' + this.props.apiId + '/editor/' + subgroupType + '/' + this.props.eId)
	}

	tabClick(path) {
		let currentLink = '/documents/' + this.props.apiId + '/'
		this.context.router.push(currentLink + path.toLowerCase())
	}

	subgroupDelete(subgroupId) {
		deleteEndpoint({ id: subgroupId })
		.then(res => {
			this.context.store.dispatch({ type: 'RESET_API_SUMMARY'}) // Setting api summary to stale
			this.context.store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'success', message: 'Endpoint deleted successfully.' }})
			this.tabClick('editor')
		})
		.catch(err => {
			this.context.store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'danger', message: err.response.data && err.response.data.message }	})
			this.tabClick('editor')
		})
	}

	render() {
		const state = this.context.store.getState()
		const endpoint = state.entities.endpoints.byIds[this.props.eId]
		if (endpoint) {
			return (
				<li id={this.props.eId} className={this.props.selected === this.props.eId ? 'subgroup-select selected': 'subgroup-select'} onClick={this.detail.bind(this, endpoint.subgroupType)}>
					{endpoint.method ? <span className={"method " + endpoint.method}>{endpoint.method}</span> : ""}
					{endpoint.subgroupType === "schema" ? <span className={"method " + endpoint.subgroupType}>schema</span> : ""}
					{endpoint.subgroupType === "textdocument" ? <span className={"method " + endpoint.subgroupType}>text</span> : ""}
					<span className={"name"}>{endpoint.name}</span>
					<ButtonMenu>
						<ButtonMenuItem onClick={this.subgroupDelete.bind(this, this.props.eId)} text="Delete"></ButtonMenuItem>
					</ButtonMenu>
				</li>
			);
		}
	}
}


export default connect(() => {})(EndpointRow)