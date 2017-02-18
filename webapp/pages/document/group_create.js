import Inferno from 'inferno'
import Component from 'inferno-component'
import { createGroup, getGroup, updateGroup } from '../../actions/group'
import FormInput from '../../components/form_input'
import FormButton from '../../components/form_button'
import Button from '../../components/button'
import CodeMirror from '../../components/codemirror'
import InputSet from '../../components/input_set'

import { connect } from 'inferno-redux'
import { renderMarkdown, removeEmptyObjects } from '../../helpers/util'

import Form from '../../components/form'
import Text from '../../components/text'

class DocumentsGroupCreate extends Component {
	constructor(props){
		super(props)
		this.state = {
			loading: false,
			groupId: this.props.params.groupId,
			mode: this.props.params.groupId == 'create' ? 'Create' : 'Edit'
		}

		this.isLoading = this.isLoading.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.cancel = this.cancel.bind(this)
	}

	fetchGroupDetails(groupId) {
		const store = this.context.store
		store.dispatch({ type: 'GET_GROUP_REQUEST'})
		this.setState({ loading: true })
		getGroup({ groupId:  groupId })
		.then(res => {
			this.setState({ loading: false })
			store.dispatch({ type: 'GET_GROUP_RESPONSE', data: res.data})
		}).catch(err => {
			this.setState({ loading: false })
			store.dispatch({ type: 'GET_GROUP_FAILURE', data: err.response.data})
		})		
	}

	componentWillMount() {
		if (this.props.params.groupId !== 'create') {
			this.context.store.dispatch({ type: 'GROUP_SELECT', data: this.props.params.groupId})
			this.setState({ mode: 'Edit' })
		} else {
			this.setState({ mode: 'Create' })
		}
	}

	componentDidMount() {	
		if (this.props.params.groupId === 'create') {
			this.context.store.dispatch({ type: 'GROUP_CREATE'})
		} else {
			this.fetchGroupDetails(this.props.params.groupId)	
		}
	}


	componentWillReceiveProps(nextProps) {
		if (this.props.group.id === nextProps.group.id) return

		if (nextProps.group.id) { //Group will be empty in create group
			this.fetchGroupDetails(nextProps.group.id)
			this.setState({ mode: 'Edit' })
		} else {
			this.setState({ mode: 'Create' })
		}
	}

	onSubmit(values) {
		event.preventDefault()
		const store = this.context.store
		const state = store.getState()
		const apiId = this.props.params.documentId
		const api = state.entities.apis.byIds[apiId]

		values = {
			...values,
			...{
				apiId: apiId,
				revision: api.currentRevision,
				descriptionHTML: renderMarkdown(values.description)
			}
		}

		if (this.props.params.groupId === 'create') {
			this.setState({ loading: true })
			createGroup(values)
			.then(res => {
				this.setState({ loading: false })
				store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'success', message: 'Group created successfully.' }	})
				store.dispatch({ type: 'CREATE_GROUP_RESPONSE', data: res.data})
			})
			.catch(err => {
				this.setState({ loading: false })
				store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'danger', message: err.response.data }	})
			})
		} else {
			values.groupId = this.props.params.groupId
			this.setState({ loading: true })
			updateGroup(values)
			.then(res => {
				this.setState({ loading: false })
				store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'success', message: 'Group updated successfully.' }	})
				store.dispatch({ type: 'UPDATE_GROUP_RESPONSE', data: res.data})
			})
			.catch(err => {
				this.setState({ loading: false })
				store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'danger', message: err.response.data }	})
			})
		}

	}
	
	isLoading() {
		return this.state.loading
	}

	cancel() {
		console.log('Click cancel')
	}
	render() {
		return (
			<div>
				<div className={"form-header-loader"}>
					<div className={"form-header"}><span>{this.state.mode} Group</span></div>
					<div className={"loader"}>{this.state.loading ? <i class="fa fa-spinner fa-spin" aria-hidden="true"></i> : ""}</div>
				</div>
				<div>
					<Form values={this.props.group} onSubmit={this.onSubmit}>
						<Text name={"name"} placeholder={"Group Name"} label={"What is the name of your group?"}  validate={['required', 'name']}/>
						<Text name={"description"} placeholder={"Group Description"} label={"Provide some description of your group?"} type={"textarea"}/>
						<Text name={"separator"} label={"Is this just a separator?"} type={"checkbox"}/>
						<Button action={"submit"} loading={this.state.isLoading} text="save"/>
					</Form>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state, ownProps) {
	let selectedGroup = state.entities.ui.apiSummary.selectedGroup
	if (state.entities.ui.apiSummary.createGroup) {
		return {
			group: {
				name: '',
				description: '',
				separator: false
			},
			selectedGroup: ''
		}
	}
	return {
		group: selectedGroup && state.entities.groups.byIds[selectedGroup] || {
			name: '',
			description: '',
			separator: false
		},
		selectedGroup
	}
}

export default connect(mapStateToProps)(DocumentsGroupCreate)
// export default DocumentsGroupCreate