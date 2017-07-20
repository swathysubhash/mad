import Inferno from 'inferno'
import Component from 'inferno-component'
import { Link } from 'inferno-router'
import { connect } from 'inferno-redux'
import ButtonMenu from '../../components/button_menu'
import ButtonMenuItem from '../../components/button_menu_item'

class DocumentsEditorOverview extends Component {
	constructor(props){
		super(props)
	}

	componentWillMount() {
		if (this.props.apiId && this.props.firstGroup) {
			this.context.store.dispatch({ type: 'GROUP_SELECT', data: ''})
			// this.context.router.push('/documents/' + this.props.apiId + '/editor/group/' + this.props.firstGroup)	
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.apiId && nextProps.firstGroup && nextProps.selected) {
			this.context.store.dispatch({ type: 'GROUP_SELECT', data: ''})
			// this.context.router.push('/documents/' + nextProps.apiId + '/editor/group/' + nextProps.firstGroup)	
		}
	}

	render() {
		return (
			<div>
				<div class="form-header">Editor Overview</div>
				{!(this.props.apiId && this.props.firstGroup) ? <div style={"text-decoration: underline; padding: 10px 0;border-radius: 3px;"}>You have not created any groups yet. You can start by creating one first.</div>
					: (<div><div>You can see the existing groups in the ADDED GROUPS section on the left.</div><div>You can add more groups or edit the existing ones.</div></div>)}
				{ this.props.api ? 
					<div className={"overview-revisions"}>
						<div><span style={"width: 150px;display: inline-block;"}>Current Revision:</span><span style={"font-weight: 600;"}>{this.props.api.currentRevision}</span></div>
						<div><span style={"width: 150px;display: inline-block;"}>Published Revision :</span><span style={"font-weight: 600;"}>{this.props.api.publishedRevision === -1 ? 'Not published' : this.props.api.publishedRevision}</span></div>
					</div>
					: "" }
				<div>
					You can see the generated document preview by clicking the preview button on the top.
				</div>
			</div>
		)
	}
}

function mapStateToProps(state, ownProps) {
	let apiId = ownProps.params.documentId
	let apis = state.entities.apis.byIds
	let selected = state.entities.ui.apiSummary.selected
	let groupIds = []
	if (apiId && apis[apiId]){
		groupIds = apis[apiId].groupIds || []
	}
	return {
		apiId: apiId,
		api: apiId && apis[apiId],
		groups: groupIds,
		firstGroup: groupIds[0],
		selected: selected,
	}
} 

export default connect(mapStateToProps)(DocumentsEditorOverview)