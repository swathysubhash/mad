import Inferno from 'inferno'
import Component from 'inferno-component'
import { getEndpoint, createEndpoint, updateEndpoint } from '../../actions/endpoint'
import Button from '../../components/button'
import CodeMirror from '../../components/codemirror'
import InputSet from '../../components/input_set'
import ObjectEditor from '../../components/object_editor'
import { connect } from 'inferno-redux'

import Form from '../../components/form'
import Text from '../../components/text'

class DocumentsEndpointCreate extends Component {
	constructor(props){
		super(props)
		this.state = {
			loading: false,
			mode: this.props.params.endpointId == 'create' ? 'create' : 'edit'
		}

		this.isLoading = this.isLoading.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.cancel = this.cancel.bind(this)
	}

	fetchEndpointDetails(endpointId) {
		const store = this.context.store
		store.dispatch({ type: 'GET_ENDPOINT_REQUEST'})
		getEndpoint({ endpointId })
		.then(res => {
			store.dispatch({ type: 'GET_ENDPOINT_RESPONSE', data: res.data})
		}).catch(err => store.dispatch({ type: 'GET_ENDPOINT_FAILURE', data: err.response.data}))		
	}

	componentWillMount() {
		if (!this.props.params.endpointId !== 'create') {
			this.context.store.dispatch({ type: 'ENDPOINT_SELECT', data: this.props.params.endpointId})
		}
	}

	componentDidMount() {
		if (this.props.params.endpointId !== 'create') {
			this.fetchEndpointDetails(this.props.params.endpointId)	
		} else {
			this.context.store.dispatch({ type: 'ENDPOINT_CREATE'})	
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.endpoint.id === nextProps.endpoint.id) return

		if (nextProps.endpoint.id) { //Group will be empty in create group
			this.fetchEndpointDetails(nextProps.endpoint.id)	
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
				revision: api.currentRevision
			}
		}
		console.log(values)

		// if (this.props.params.endpointId === 'create') {
		// 	this.setState({ loading: true })
		// 	createEndpoint(values)
		// 	.then(res => {
		// 		this.setState({ loading: false })
		// 		store.dispatch({ type: 'CREATE_ENDPOINT_RESPONSE', data: res.data})
		// 	})
		// 	.catch(err => {
		// 		this.setState({ loading: false })
		// 		store.dispatch({ type: 'CREATE_ENDPOINT_FAILURE', data: err.response.data})
		// 	})
		// } else {
		// 	values.endpointId = this.props.endpoint.id
		// 	this.setState({ loading: true })
		// 	updateEndpoint(values)
		// 	.then(res => {
		// 		this.setState({ loading: false })
		// 		store.dispatch({ type: 'UPDATE_ENDPOINT_RESPONSE', data: res.data})
		// 	})
		// 	.catch(err => {
		// 		this.setState({ loading: false })
		// 		store.dispatch({ type: 'UPDATE_ENDPOINT_FAILURE', data: err.response.data})
		// 	})
		// }
	}
	
	isLoading() {
		return this.state.loading
	}

	cancel() {
		console.log('Click cancel')
	}
	render() {
		// if (this.props.params.groupId !== 'create') {
		// 	const state = this.context.store.getState()
		// 	const group = state.entities.groups.byIds[this.props.params.groupId]
		// 	this.state.formData.name.value = group.name
		// 	this.state.formData.separator.value = group.separator	
		// }
		// <CodeMirror defaultValue={""} value={"valuecm"} options={cmOptions}/>
		// let cmOptions = {
		// 	lineNumbers: true,
		// 	mode: 'javascript'
		// }
		// <Text name={"responseHeader"} label={"Response json?"} type={"codemirror"}/>
		// <Text name={"method"} label={"What is the http method?"} type={"dropdown"}
		// 				options={[{ value: "GET", label: "GET"}, { value: "POST", label: "POST"}, { value: "PUT", label: "PUT"}]}/>
		// <InputSet valueSet={[{name: '', method: ''}]}>
		// <Text name={"name"} placeholder={"Group Name"} label={"What is the name of your group?"}  validate={['required', 'name']}/>
		// <Text name={"method"} label={"What is the http method?"} type={"dropdown"}
		// 				options={[{ value: "GET", label: "GET"}, { value: "POST", label: "POST"}, { value: "PUT", label: "PUT"}]}/>
		// </InputSet>
		const state = this.context.store.getState()
		let groups = state.entities.groups.byIds
		let groupOptions = this.props.groups.map(g => ({ label: groups[g].name, value: g}))

		return (
			<div>
				<div>{this.state.mode} Endpoint</div>
				<div>
					<Form values={this.props.endpoint} onSubmit={this.onSubmit}>
						<Text name={"groupName"} type={"dropdown"} label={"What is the group of your endpoint?"}  validate={['required']}
							options={groupOptions}/>
						<Text name={"name"} placeholder={"Endpoint Name"} label={"What is the name of your endpoint?"}  validate={['required', 'name']}/>
						<Text name={"description"} placeholder={"Endpoint Description"} label={"Provide some description of your endpoint?"} type={"textarea"}/>
						<Text name={"url"} placeholder={"Url"} label={"What is the url of your endpoint?"}  validate={['required']}/>
						<Text name={"method"} type={"dropdown"} label={"What is the http method of your endpoint?"}  validate={['required']}
							options={[{ value: "GET", label: "GET"}, { value: "POST", label: "POST"}, { value: "PUT", label: "PUT"}]}/>
						<InputSet name={"queryParameters"} label={"Query Parameters"}>
							<Text name={"name"} placeholder={"Name"}/>
							<Text name={"example"} placeholder={"Sample Value"}/>
							<Text name={"default"} placeholder={"Default Value"}/>
							<Text name={"required"} type={"dropdown"} options={[{ value: "mandatory", label: "mandatory"}, { value: "optional", label: "optional"}]}/>
						</InputSet>
						<InputSet name={"urlParameters"} label={"Url Parameters"}>
							<Text name={"name"} placeholder={"Name"}/>
							<Text name={"example"} placeholder={"Sample Value"}/>
							<Text name={"default"} placeholder={"Default Value"}/>
							<Text name={"required"} type={"dropdown"} options={[{ value: "mandatory", label: "mandatory"}, { value: "optional", label: "optional"}]}/>
						</InputSet>
						<InputSet name={"requestHeaders"} label={"Request Headers"}>
							<Text name={"name"} placeholder={"Name"}/>
							<Text name={"example"} placeholder={"Sample Value"}/>
							<Text name={"default"} placeholder={"Default Value"}/>
						</InputSet>
						<Text name={"requestBody"} label={"Request json?"} type={"codemirror"}/>
						<InputSet name={"responseHeaders"} label={"Response Headers"}>
							<Text name={"name"} placeholder={"Name"} />
							<Text name={"example"} placeholder={"Sample Value"}/>
							<Text name={"default"} placeholder={"Default Value"}/>
						</InputSet>
						<Text name={"responseBody"} label={"Response json?"} type={"codemirror"}/>
						<Button action={"submit"} loading={this.state.isLoading} text="create"/>
						<Button onClick={this.cancel} action={"secondary"} loading={() => false} text="cancel"/>
					</Form>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state, ownProps) {
	let selectedEndpoint = state.entities.ui.apiSummary.selectedEndpoint
	let api = state.entities.apis.byIds[ownProps.params.documentId] || {}
	if (state.entities.ui.apiSummary.createEndpoint) {
		return {
			endpoint:  {
				name: '',
				description: '',
				url: '',
				method: '',
				groupName: '',
				queryParameters: [{name: '', value: '', example: '', required: ''}],
				urlParameters: [{name: '', value: '', example: '', required: ''}],
				requestHeaders: [{name: '', value: '', example: ''}],
				requestBody: '',
				responseHeaders: [{name: '', value: '', example: ''}],
				responseBody: '',
				languageSnippets: []
			},
			groups: api.groupIds || [],
			selectedEndpoint: ''

		}
	}
	let endpoint = (selectedEndpoint && state.entities.endpoints.byIds[selectedEndpoint])
	let groups = state.entities.groups.byIds
	return {
		endpoint: {
			...{
				name: '',
				description: '',
				url: '',
				groupName: endpoint && groups && groups[endpoint.groupId] && groups[endpoint.groupId].name,
				method: '',
				queryParameters: [{name: 'a', value: 'v', example: 'c', required: 's'}, {name: 'a1', value: 'v1', example: 'c1', required: 's1'}],
				urlParameters: [{name: '', value: '', example: '', required: ''}],
				requestHeaders: [{name: '', value: '', example: ''}],
				requestBody: '',
				responseHeaders: [{name: '', value: '', example: ''}],
				responseBody: '',
				languageSnippets: []
			},
			...endpoint
		},
		groups: api.groupIds || [],
		selectedEndpoint
	}
}

export default connect(mapStateToProps)(DocumentsEndpointCreate)