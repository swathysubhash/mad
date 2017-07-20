import Inferno from 'inferno'
import Component from 'inferno-component'
import { connect } from 'inferno-redux'
import EndpointRow from './endpoint_row'
import ButtonMenu from '../../components/button_menu'
import ButtonMenuItem from '../../components/button_menu_item'
import dragula from 'dragula'
import { deleteGroup } from '../../actions/group'

class GroupRow extends Component {
	constructor(props){
		super(props)
		this.detail = this.detail.bind(this)
	}

	detail(event) {
		event.stopPropagation()
		this.context.store.dispatch({ type: 'GROUP_SELECT', data: this.props.gId})
		this.context.router.push('/documents/' + this.props.apiId + '/editor/group/' + this.props.gId)
	}

	componentDidMount() {
		if (this.subgroupHandle) {
			if (!this.subgroupHandle.dragHandler) {
				dragula([this.subgroupHandle]).on('drop', function(){console.log(arguments)})	
			}
			this.subgroupHandle.dragHandler = true
		}
	}


	componentDidUpdate() {
		if (this.subgroupHandle) {
				if (!this.subgroupHandle.dragHandler) {
					dragula([this.subgroupHandle]).on('drop', function(){console.log(arguments)})	
				}
				this.subgroupHandle.dragHandler = true
		}
	}

	endpointCreate(groupId) {
		this.context.store.dispatch({ type: 'ENDPOINT_CREATE', data: groupId })
		this.context.router.push(`/documents/${this.props.apiId}/editor/endpoint/create`)
	}

	schemaCreate(groupId) {
		this.context.store.dispatch({ type: 'SCHEMA_CREATE', data: groupId })
		this.context.router.push(`/documents/${this.props.apiId}/editor/schema/create`)
	}

	textDocumentCreate(groupId) {
		this.context.store.dispatch({ type: 'TEXTDOCUMENT_CREATE', data: groupId })
		this.context.router.push(`/documents/${this.props.apiId}/editor/textdocument/create`)
	}
	
	tabClick(path) {
		let currentLink = '/documents/' + this.props.apiId + '/'
		this.context.router.push(currentLink + path.toLowerCase())
	}

	groupDelete(groupId) {
		deleteGroup({ id: groupId })
		.then(res => {
			this.context.store.dispatch({ type: 'RESET_API_SUMMARY'}) // Setting api summary to stale
			this.context.store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'success', message: 'Group deleted successfully.' }})
			this.tabClick('editor')
		})
		.catch(err => {
			this.tabClick('editor')
			this.context.store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'danger', message: err.response.data && err.response.data.message }	})
		})
	}

	render() {
		const state = this.context.store.getState()
		const group = state.entities.groups.byIds[this.props.gId]
		if (group) {
			return (
				<div id={this.props.gId} className={"summary-group-row"}>
					<div className={this.props.selected === this.props.gId ? 'selected group-select': 'group-select'} onClick={this.detail}>
						<i class="fa fa-folder-open-o" aria-hidden="true"></i>
						<span>{group.name}</span>
						<ButtonMenu>
							<ButtonMenuItem onClick={this.endpointCreate.bind(this, this.props.gId)} text="Add Endpoint"></ButtonMenuItem>
							<ButtonMenuItem onClick={this.schemaCreate.bind(this, this.props.gId)} text="Add Schema"></ButtonMenuItem>
							<ButtonMenuItem onClick={this.textDocumentCreate.bind(this, this.props.gId)} text="Add Text"></ButtonMenuItem>
							<ButtonMenuItem onClick={this.groupDelete.bind(this, this.props.gId)} text="Delete"></ButtonMenuItem>
						</ButtonMenu>
					</div>
					<div className={"summary-subgroup-row"} ref={(handle) => { this.subgroupHandle = handle }}>
						{group.endpoints.map( e => <EndpointRow eId={e} selected={this.props.selected} apiId={this.props.apiId}/>)}
					</div>
				</div>
			);		
		}
	}
}

export default connect(() => {})(GroupRow)