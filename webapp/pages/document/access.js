import './access.less'
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
		}).catch(err => {
			store.dispatch({ type: 'GET_ACCESS_FAILURE', data: err.response.data})
			store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'danger', message: err.response.data && err.response.data.message }	})
		})		
	}

	updateAnonymous(values) {
		const store = this.context.store
		store.dispatch({ type: 'UPDATE_API_REQUEST'})
		updateApi({ apiId: this.props.apiId, anonymousAccess: values.access.value })
		.then(res => {
			store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'success', message: 'Updated successfully.' }	})
			store.dispatch({ type: 'UPDATE_API_RESPONSE', data: res.data})
		}).catch(err => {
			store.dispatch({ type: 'UPDATE_API_FAILURE', data: err.response.data})
			store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'danger', message: err.response.data && err.response.data.message }	})
		})		
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
				store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'success', message: 'Updated successfully.' }	})
				store.dispatch({ type: 'UPDATE_ACCESS_RESPONSE', data: res.data})
			}).catch(err => {
				store.dispatch({ type: 'UPDATE_ACCESS_FAILURE', data: err.response.data})
				store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'danger', message: err.response.data && err.response.data.message }	})
			})			
		} else {
			store.dispatch({ type: 'CREATE_ACCESS_REQUEST'})
			createApiAccess(newUser)
			.then(res => {
				store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'success', message: 'Created successfully.' }	})
				store.dispatch({ type: 'CREATE_ACCESS_RESPONSE', data: res.data})
			}).catch(err => {
				store.dispatch({ type: 'CREATE_ACCESS_FAILURE', data: err.response.data})
				store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'danger', message: err.response.data && err.response.data.message }	})
			})			
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
			<div className={"doc-access"}>
				<div className={"form-header"}>Documentation Access</div>
				<div>
					<div className={"sub-header"}>Anonymous Access</div>
					<div className={"anon-form"}>
						<Form values={this.props.anonymousAccess} onSubmit={this.updateAnonymous}>
							<Text 
							name={"access"} type={"dropdown"} label={"What anonymous users can do?"}
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
					<div className={"sub-header"}>Users</div>
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
							<Button action={"submit"} loading={this.state.isLoading} text="save"/>
							<button onClick={this.removeUser.bind(this, u)} className={"remove"} loading={this.state.isLoading}>remove</button>
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