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
		if (nextProps.apiId && nextProps.firstGroup) {
			this.context.store.dispatch({ type: 'GROUP_SELECT', data: ''})
			// this.context.router.push('/documents/' + nextProps.apiId + '/editor/group/' + nextProps.firstGroup)	
		}
	}

	render() {
		return (
			<div>
				<div class="form-header">Editor Overview</div>
				{!(this.props.apiId && this.props.firstGroup) ? <div>You have not created any document yet. You can start by creating a group first.</div>
					: (<div><div>You can see the existing groups in the ADDED GROUPS section on the left.</div><div>You can add more groups or edit the existing ones.</div></div>)}
			</div>
		)
	}
}

function mapStateToProps(state, ownProps) {
	let apiId = ownProps.params.documentId
	let apis = state.entities.apis.byIds
	let groupIds = []
	if (apiId && apis[apiId]){
		groupIds = apis[apiId].groupIds || []
	}
	return {
		apiId: apiId,
		api: apiId && apis[apiId],
		groups: groupIds,
		firstGroup: groupIds[0]
	}
} 

export default connect(mapStateToProps)(DocumentsEditorOverview)