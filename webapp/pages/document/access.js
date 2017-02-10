import Inferno from 'inferno'
import Component from 'inferno-component'
import Text from '../../components/text'
import Form from '../../components/form'
import Button from '../../components/button'
import { getApiAccess, createApiAccess, updateApiAccess, updateApi } from '../../actions/api'
import { connect } from 'inferno-redux'

class DocumentsAccess extends Component {
	constructor(props){
		super(props)
		this.updateUser = this.updateUser.bind(this)
		this.removeUser = this.removeUser.bind(this)
		this.updateAnonymous = this.updateAnonymous.bind(this)
	}

	fetchAccess(documentId) {
		const store = this.context.store
		store.dispatch({ type: 'GET_ACCESS_REQUEST'})
		getApiAccess({ documentId })
		.then(res => {
			store.dispatch({ type: 'GET_ACCESS_RESPONSE', data: { ...res.data, ...{ id: documentId }}})
		}).catch(err => store.dispatch({ type: 'GET_ACCESS_FAILURE', data: err.response.data}))		
	}

	updateAnonymous(values) {
		const store = this.context.store
		store.dispatch({ type: 'UPDATE_API_REQUEST'})
		updateApi({ apiId: this.props.apiId, anonymousAccess: values.access.value })
		.then(res => {
			store.dispatch({ type: 'UPDATE_API_RESPONSE', data: res.data})
		}).catch(err => store.dispatch({ type: 'UPDATE_API_FAILURE', data: err.response.data}))		
	}

	updateUser(old, newUser) {
		if (newUser.permission instanceof Object) {
			newUser.permission = newUser.permission.value
			newUser.resourceType = 'api'
			newUser.resourceId = this.props.apiId
			newUser.actorType = 'user'
		}
		const store = this.context.store
		if (old.actorId) {
			store.dispatch({ type: 'UPDATE_ACCESS_REQUEST'})
			updateApiAccess(newUser)
			.then(res => {
				store.dispatch({ type: 'UPDATE_ACCESS_RESPONSE', data: res.data})
			}).catch(err => store.dispatch({ type: 'UPDATE_ACCESS_FAILURE', data: err.response.data}))			
		} else {
			store.dispatch({ type: 'CREATE_ACCESS_REQUEST'})
			createApiAccess(newUser)
			.then(res => {
				store.dispatch({ type: 'CREATE_ACCESS_RESPONSE', data: res.data})
			}).catch(err => store.dispatch({ type: 'CREATE_ACCESS_FAILURE', data: err.response.data}))			
		}
	}

	removeUser(user) {
		console.log(arguments)
	}

	componentWillReceiveProps(nextProps) {

	}

	componentDidMount() {
		this.fetchAccess(this.props.apiId)
	}

	render() {
		return (
			<div>
				<div>Documentation Access</div>
				<div>
					<div>Anonymous Access</div>
					<div>
						<div>Only you have access now (Private)</div>
						<Form values={this.props.anonymousAccess} onSubmit={this.updateAnonymous}>
							<Text 
							name={"access"} type={"dropdown"} 
							options={
								[{ value: "none", label: "none"},
								{ value: "read", label: "read"},
								{ value: "write", label: "write"},
								{ value: "admin", label: "admin"}]
							}/>
							<Button action={"submit"} loading={this.state.isLoading} text="save"/>
						</Form>
					</div>
				</div>
				<div>
					<div>Users</div>
					{this.props.users.map(u => (
						<Form values={u} onSubmit={this.updateUser.bind(this, u)}>
							<Text name={"actorId"} />
							<Text 
							name={"permission"} type={"dropdown"} 
							options={
								[{ value: "read", label: "read"},
								{ value: "write", label: "write"},
								{ value: "admin", label: "admin"}]
							}/>
							<Button onClick={this.removeUser.bind(this, u)} loading={this.state.isLoading} text="remove"/>
							<Button action={"submit"} loading={this.state.isLoading} text="save"/>
						</Form>
					))}
					<Form values={this.props.newUser} onSubmit={this.updateUser.bind(this, this.props.newUser)}>
						<Text name={"actorId"} />
						<Text 
						name={"permission"} type={"dropdown"} 
						options={
							[{ value: "read", label: "read"},
							{ value: "write", label: "write"},
							{ value: "admin", label: "admin"}]
						}/>
						<Button action={"submit"} loading={this.state.isLoading} text="save"/>
					</Form>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	let api = state.entities.apis.byIds[ownProps.params.documentId]
	let access = { value: "none", label: "none"}
	let users = []
	if (api) {
		access = api.anonymousAccess
		users = api.users || []
	}
	return {
		apiId: ownProps.params.documentId,
		anonymousAccess: {
			access
		},
		users,
		newUser: {
			actorId: ''
		}
	}
}
export default connect(mapStateToProps)(DocumentsAccess)