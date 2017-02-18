import Inferno from 'inferno'
import Component from 'inferno-component'
import { getEndpoint, createEndpoint, updateEndpoint } from '../../actions/endpoint'
import Button from '../../components/button'
import CodeMirror from '../../components/codemirror'
import InputSet from '../../components/input_set'
import { connect } from 'inferno-redux'
import SchemaEditor from '../../components/schema_editor'
import { renderMarkdown, removeEmptyObjects } from '../../helpers/util'

import Form from '../../components/form'
import Text from '../../components/text'

const EMPTY_SUBGROUP = {
	name: '',
	description: '',
	url: '',
	method: '',
	groupName: { label: 'Select Group', value: '' },
	queryParameters: [{name: '', defaultValue: '', description: '', required: true}],
	urlParameters: [{name: '', defaultValue: '', description: '', required: true}],
	requestHeaders: [{name: '', value: ''}],
	requestBody: '',
	responseHeaders: [{name: '', value: ''}],
	responseBody: '',
	languageSnippets: [],
	schema: '{}',
}

class DocumentsEndpointCreate extends Component {
	constructor(props){
		super(props)
		this.state = {
			loading: false,
			mode: this.props.params.endpointId == 'create' ? 'Create' : 'Edit',
			values: this.props.endpoint
		}
		this.isLoading = this.isLoading.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
		this.cancel = this.cancel.bind(this)
	}

	toState(data) {

	}

	fetchEndpointDetails(endpointId) {
		const store = this.context.store
		this.setState({ loading : true})
		getEndpoint({ endpointId })
		.then(res => {
			this.setState({ loading : false })
			//store.dispatch({ type: 'GET_ENDPOINT_RESPONSE', data: res.data})
		}).catch(err => {
			this.setState({ loading : false })
			store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'danger', message: err.response.data }	})
		})		
	}

	componentWillMount() {
		if (!this.props.params.endpointId !== 'create') {
			this.context.store.dispatch({ type: 'ENDPOINT_SELECT', data: this.props.params.endpointId})
		}
	}

	componentDidMount() {
		if (this.props.params.endpointId !== 'create') {
			this.fetchEndpointDetails(this.props.params.endpointId)	
			// this.context.store.dispatch({ type: 'ENDPOINT_SELECT', data: this.props.params.endpointId})
		} else {
			if (this.props.subgroupType === 'schema') 
				this.context.store.dispatch({ type: 'SCHEMA_CREATE'})	
			else 
				this.context.store.dispatch({ type: 'ENDPOINT_CREATE'})	
		}	
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.endpoint.id === nextProps.endpoint.id) {
			return
		}

		
			if (nextProps.endpoint.id) { //Group will be empty in create group
				this.fetchEndpointDetails(nextProps.endpoint.id)
				this.setState({ mode: 'Edit', values: nextProps.endpoint })
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

		let urlParameters = removeEmptyObjects(values.urlParameters, ['name']).map( u => {
			u.descriptionHTML = renderMarkdown(u.description)
			return u
		})
		let queryParameters = removeEmptyObjects(values.queryParameters, ['name']).map( q => {
			q.descriptionHTML = renderMarkdown(q.description)
			return q
		})

		values = {
			...values,
			...{
				apiId: apiId,
				subgroupType: this.props.subgroupType,
				revision: api.currentRevision,
				descriptionHTML: renderMarkdown(values.description),
				queryParameters,
				urlParameters,
				groupId: values.groupName.value,
				method: values.method.value,
				requestHeaders: removeEmptyObjects(values.requestHeaders, ['name']),
				responseHeaders: removeEmptyObjects(values.responseHeaders, ['name'])
			}
		}
		console.log(values)

		if (this.props.params.endpointId === 'create') {
			this.setState({ loading: true })
			createEndpoint(values)
			.then(res => {
				this.setState({ loading: false })
				store.dispatch({ type: 'CREATE_ENDPOINT_RESPONSE', data: res.data})
				store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'success', message: 'Endpoint created successfully.' }})
			})
			.catch(err => {
				this.setState({ loading: false })
				store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'danger', message: err.response.data }	})
			})
		} else {
			values.endpointId = this.props.endpoint.id
			this.setState({ loading: true })
			updateEndpoint(values)
			.then(res => {
				this.setState({ loading: false })
				store.dispatch({ type: 'UPDATE_ENDPOINT_RESPONSE', data: res.data})
				store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'success', message: 'Endpoint updated successfully.' }})
			})
			.catch(err => {
				this.setState({ loading: false })
				store.dispatch({ type: 'UPDATE_ENDPOINT_FAILURE', data: err.response.data})
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
		const state = this.context.store.getState()
		let groups = state.entities.groups.byIds
		let groupOptions = this.props.groups.map(g => ({ label: groups[g].name, value: g}))

		if (this.props.subgroupType === 'endpoint') {
			return (
				<div>
					<div className={"form-header-loader"}>
						<div className={"form-header"}><span>{this.state.mode} Endpoint</span></div>
						<div className={"loader"}>{this.state.loading ? <i class="fa fa-spinner fa-spin" aria-hidden="true"></i> : ""}</div>
					</div>
					<div>
						<Form values={this.state.values} onSubmit={this.onSubmit}>
							<Text name={"groupName"} type={"dropdown"} label={"What is the group of your endpoint?"}  validate={['required']}
								options={groupOptions}/>
							<Text name={"name"} placeholder={"Endpoint Name"} label={"What is the name of your endpoint?"}  validate={['required', 'name']}/>
							<Text name={"description"} placeholder={"Endpoint Description"} label={"Provide some description of your endpoint?"} type={"textarea"}/>
							<Text name={"url"} placeholder={"Url"} label={"What is the url of your endpoint?"}  validate={['required']}/>
							<Text name={"method"} type={"dropdown"} label={"What is the http method of your endpoint?"}  validate={['required']}
								options={[{ value: "GET", label: "GET"}, { value: "POST", label: "POST"}, { value: "PUT", label: "PUT"}]}/>
							<InputSet name={"queryParameters"} label={"Query Parameters"}>
								<Text className={"col3"} name={"name"} placeholder={"Name"}/>
								<Text className={"col5"} name={"description"} placeholder={"Description"} options={{toolbar: false, status: false}} label={"Provide some description of your endpoint?"} type={"textarea"}/>
								<Text className={"col3"} name={"default"} placeholder={"Default Value"}/>
								<Text className={"col3"} name={"required"} id={"qpr"} type={"checkbox"}/>
							</InputSet>
							<InputSet name={"urlParameters"} label={"Url Parameters"}>
								<Text className={"col3"} name={"name"} placeholder={"Name"}/>
								<Text className={"col5"} name={"description"} placeholder={"Description"} options={{toolbar: false, status: false}} label={"Provide some description of your endpoint?"} type={"textarea"}/>
								<Text className={"col3"} name={"default"} placeholder={"Default Value"}/>
								<Text className={"col3"} name={"required"} id={"upr"} type={"checkbox"}/>
							</InputSet>
							<InputSet name={"requestHeaders"} label={"Request Headers"}>
								<Text className={"col5"} name={"name"} placeholder={"Name"}/>
								<Text className={"col5"} name={"value"} placeholder={"value"}/>
							</InputSet>
							<Text name={"requestBody"} label={"Request json?"} type={"codemirror"}/>
							<InputSet name={"responseHeaders"} label={"Response Headers"}>
								<Text className={"col5"} name={"name"} placeholder={"Name"} />
								<Text className={"col5"} name={"value"} placeholder={"value"} />
							</InputSet>
							<Text name={"responseBody"} label={"Response json?"} type={"codemirror"}/>
							<Button action={"submit"} loading={this.state.loading} text="save"/>
						</Form>
					</div>
				</div>
			)
		} else if (this.props.subgroupType === 'schema') {
			return (
				<div>
				<div className={"form-header-loader"}>
					<div className={"form-header"}><span>{this.state.mode} Schema</span></div>
					<div className={"loader"}>{this.state.loading ? <i class="fa fa-spinner fa-spin" aria-hidden="true"></i> : ""}</div>
				</div>
				<Form values={this.state.values} onSubmit={this.onSubmit}>
				<Text name={"groupName"} type={"dropdown"} label={"What is the group of your schema?"}  validate={['required']}
								options={groupOptions}/>
				<Text name={"name"} placeholder={"Endpoint Name"} label={"What is the name of your schema?"}  validate={['required', 'name']}/>
				<SchemaEditor name={"schema"} />
				<Button action={"submit"} loading={this.state.loading} text="save"/>
				</Form>
				</div>
			)
		}
		
	}
}

function mapStateToProps(state, ownProps) {
	let selectedEndpoint = state.entities.ui.apiSummary.selectedEndpoint
	let api = state.entities.apis.byIds[ownProps.params.documentId] || {}
	let subgroupType = ownProps.subgroupType
	if (subgroupType === 'endpoint' && state.entities.ui.apiSummary.createEndpoint 
		|| subgroupType === 'schema' && state.entities.ui.apiSummary.createSchema) {
		return {
			endpoint:  {
				name: '',
				description: '',
				url: '',
				method: '',
				groupName: { label: 'Select Group', value: '' },
				queryParameters: [{name: '', defaultValue: '', description: '', required: true}],
				urlParameters: [{name: '', defaultValue: '', description: '', required: true}],
				requestHeaders: [{name: '', value: ''}],
				requestBody: '',
				responseHeaders: [{name: '', value: ''}],
				responseBody: '',
				languageSnippets: [],
				schema: '{}',
			},
			groups: api.groupIds || [],
			selectedEndpoint: '',
			subgroupType
		}
	}
	let endpoint = (selectedEndpoint && state.entities.endpoints.byIds[selectedEndpoint])
	let groups = state.entities.groups.byIds
	let selectedGroup = endpoint && groups && groups[endpoint.groupId]

	// TODO
	if(endpoint && endpoint.queryParameters && !endpoint.queryParameters.length) {
		endpoint.queryParameters = [{name: '', defaultValue: '', description: '', required: true}]
	}
	if(endpoint && endpoint.urlParameters && !endpoint.urlParameters.length) {
		endpoint.urlParameters = [{name: '', defaultValue: '', description: '', required: true}]
	}
	if(endpoint && endpoint.requestHeaders && !endpoint.requestHeaders.length) {
		endpoint.requestHeaders = [{name: '', value: ''}]
	}
	if(endpoint && endpoint.responseHeaders && !endpoint.responseHeaders.length) {
		endpoint.responseHeaders = [{name: '', value: ''}]
	}

	return {
		endpoint: {
			...{
				name: '',
				description: '',
				url: '',
				groupName: (selectedGroup && { label: selectedGroup.name, value: selectedGroup.id }) || { label: 'Select Group', value: '' },
				method: '',
				queryParameters: [{name: '', defaultValue: '', description: '', required: true}],
				urlParameters: [{name: '', defaultValue: '', description: '', required: true}],
				requestHeaders: [{name: '', value: ''}],
				requestBody: '',
				responseHeaders: [{name: '', value: ''}],
				responseBody: '',
				languageSnippets: [],
				schema: '{}',
			},
			...endpoint
		},
		groups: api.groupIds || [],
		selectedEndpoint,
		subgroupType
	}
}

export default connect(mapStateToProps)(DocumentsEndpointCreate)