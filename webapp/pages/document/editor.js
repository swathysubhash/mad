import './editor.less'
import Inferno from 'inferno'
import Component from 'inferno-component'
import { Link } from 'inferno-router'
import { connect } from 'inferno-redux'
import ButtonMenu from '../../components/button_menu'
import ButtonMenuItem from '../../components/button_menu_item'
import ApiSummary from './api_summary'

class DocumentsEditor extends Component {
	constructor(props){
		super(props)
		this.groupCreate = this.groupCreate.bind(this)
		this.endpointCreate = this.endpointCreate.bind(this)
		this.schemaCreate = this.schemaCreate.bind(this)
		this.textDocumentCreate = this.textDocumentCreate.bind(this)
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
		this.context.store.dispatch({ type: 'SCHEMA_CREATE' })
		this.context.router.push(`/documents/${this.props.params.documentId}/editor/schema/create`)
	}

	textDocumentCreate() {
		this.context.store.dispatch({ type: 'TEXTDOCUMENT_CREATE' })
		this.context.router.push(`/documents/${this.props.params.documentId}/editor/textdocument/create`)
	}

	render() {
		return (
			<div className={"api-editor"}>
				<div className={"fixed-wrapper middle"}>
					<div className={"left"}> 
						<div className={"add-actions"}>
							<button className={this.props.createGroup ? "selected": ""} onClick={this.groupCreate}><i class="fa fa-folder" aria-hidden="true"></i>Add Group</button>
							<button className={this.props.createEndpoint ? "selected": ""} onClick={this.endpointCreate}><i class="fa fa-file-o" aria-hidden="true"></i>Add Endpoint</button>
							<button className={this.props.createSchema ? "selected": ""} onClick={this.schemaCreate}><i class="fa fa-file-code-o" aria-hidden="true"></i>
Add Schema</button>
							<button className={this.props.createTextDocument ? "selected": ""} onClick={this.textDocumentCreate}><i class="fa fa-file-text-o" aria-hidden="true"></i>Add Text Document</button>
							{/*<ButtonMenu text="Add new">
								<ButtonMenuItem onClick={this.groupCreate} text="Group"></ButtonMenuItem>
								<ButtonMenuItem onClick={this.endpointCreate} text="Endpoint"></ButtonMenuItem>
								<ButtonMenuItem onClick={this.schemaCreate} text="Schema"></ButtonMenuItem>
							</ButtonMenu>*/}
						</div>
						<div>
							<div className={"api-summary"}>
								<ApiSummary documentId={this.props.params.documentId}></ApiSummary>
							</div>
						</div>
					</div>
				</div>
				<div className={"right"}>
						<div className="forms-placeholder">
							{this.props.children}
						</div>
				</div>
			</div>
		);
	}
}


function mapStateToProps(state, ownProps) {
	let ui = state.entities.ui.apiSummary
	return {
		createGroup: ui.createGroup,
		createEndpoint: ui.createEndpoint,
		createSchema: ui.createSchema,
		createTextDocument: ui.createTextDocument,
	}
} 

export default connect(mapStateToProps)(DocumentsEditor)
