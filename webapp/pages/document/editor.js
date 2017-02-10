import './editor.less'
import Inferno from 'inferno'
import Component from 'inferno-component'
import { Link } from 'inferno-router'
import ButtonMenu from '../../components/button_menu'
import ButtonMenuItem from '../../components/button_menu_item'
import ApiSummary from './api_summary'

class DocumentsEditor extends Component {
	constructor(props){
		super(props)
		this.groupCreate = this.groupCreate.bind(this)
		this.endpointCreate = this.endpointCreate.bind(this)
		this.schemaCreate = this.schemaCreate.bind(this)
	}

	groupCreate() {
		this.context.store.dispatch({ type: 'GROUP_CREATE' })
		this.context.router.push(`/documents/${this.props.params.documentId}/editor/group/create`)
	}

	endpointCreate() {
		this.context.store.dispatch({ type: 'ENDPOINT_CREATE' })
		this.context.router.push(`/documents/${this.props.params.documentId}/editor/endpoint/create`)
	}

	schemaCreate() {
		this.context.store.dispatch({ type: 'ENDPOINT_CREATE' })
		this.context.router.push(`/documents/${this.props.params.documentId}/editor/schema/create`)
	}

	render() {
		return (
			<div>
				<div>DocumentsEditor</div>
				<div className={"loader"}>
					<div className={"loader-bubble"}> 
						<div className={"loader-bubble loader-bubble-1"}></div>
						<div className={"loader-bubble loader-bubble-2"}></div>
						<div className={"loader-bubble loader-bubble-3"}></div>
					</div>
				</div>
				<ButtonMenu text="Create new">
					<ButtonMenuItem onClick={this.groupCreate} text="Group"></ButtonMenuItem>
					<ButtonMenuItem onClick={this.endpointCreate} text="Endpoint"></ButtonMenuItem>
					<ButtonMenuItem onClick={this.schemaCreate} text="Schema"></ButtonMenuItem>
				</ButtonMenu>
				<div>
					<div className="api-summary">
						<ApiSummary documentId={this.props.params.documentId}></ApiSummary>
					</div>
					<div className="forms-placeholder">
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}

export default DocumentsEditor