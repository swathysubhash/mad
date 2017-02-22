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
			values: EMPTY_SUBGROUP
		}
		this.isLoading = this.isLoading.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	toState(data) {
		let groups = this.props.groups
		let selectedGroup = {}
		if (data && groups && groups[data.groupId]) {
			selectedGroup = { 
				groupName: { label: groups[data.groupId].name, value: groups[data.groupId].id }
			}
		}
		if (data.queryParameters && !data.queryParameters.length) data.queryParameters = ''
		if (data.urlParameters && !data.urlParameters.length) data.urlParameters = ''	
		if (data.requestHeaders && !data.requestHeaders.length) data.requestHeaders = ''
		if (data.responseHeaders && !data.responseHeaders.length) data.responseHeaders = ''

		return {
			...EMPTY_SUBGROUP,
			...data,
			...selectedGroup,
		}
	}

	fetchEndpointDetails(endpointId) {
		const store = this.context.store
		this.setState({ loading : true})
		getEndpoint({ endpointId })
		.then(res => {
			this.setState({ loading : false, values: this.toState(res.data) })
			//store.dispatch({ type: 'GET_ENDPOINT_RESPONSE', data: res.data})
		}).catch(err => {
			this.setState({ loading : false })
			store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'danger', message: err.response.data }	})
		})		
	}

	componentWillMount() {
		if (this.props.params.endpointId !== 'create') {
			this.context.store.dispatch({ type: 'ENDPOINT_SELECT', data: this.props.params.endpointId})
		}
	}

	componentDidMount() {
		if (this.props.params.endpointId !== 'create') {
			this.fetchEndpointDetails(this.props.params.endpointId)	
			// this.context.store.dispatch({ type: 'ENDPOINT_SELECT', data: this.props.params.endpointId})
		} else {
			if (this.props.subgroupType === 'schema') {
				this.context.store.dispatch({ type: 'SCHEMA_CREATE'})	
			} else if (this.props.subgroupType === 'textdocument'){
				this.context.store.dispatch({ type: 'TEXTDOCUMENT_CREATE'})	
			} else {
				this.context.store.dispatch({ type: 'ENDPOINT_CREATE'})	
			}
		}	
	}

	componentWillReceiveProps(nextProps) {
		// if (this.props.endpoint.id === nextProps.endpoint.id) {
		// 	return
		// }
		
		if (nextProps.selected) { //Group will be empty in create group
			this.fetchEndpointDetails(nextProps.selected)
		} else {
			this.setState({ values:  EMPTY_SUBGROUP })
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

		if (this.props.params.endpointId === 'create') {
			this.setState({ loading: true, values  })
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
			// values.endpointId = this.state.values.id
			this.setState({ loading: true, values })
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

	render() {
		let groupOptions = Object.values(this.props.groups).map(g => ({ label: g.name, value: g.id }))

		if (this.props.subgroupType === 'endpoint') {
			return (
				<div>
					<div className={"form-header-loader"}>
						<div className={"form-header"}><span>{this.props.mode} Endpoint</span></div>
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
				<Text name={"name"} placeholder={"Schema Name"} label={"What is the name of your schema?"}  validate={['required', 'name']}/>
				<SchemaEditor name={"schema"} />
				<Button action={"submit"} loading={this.state.loading} text="save"/>
				</Form>
				</div>
			)
		} else if (this.props.subgroupType === 'textdocument') {
			return (
				<div>
				<div className={"form-header-loader"}>
					<div className={"form-header"}><span>{this.state.mode} Text Document</span></div>
					<div className={"loader"}>{this.state.loading ? <i class="fa fa-spinner fa-spin" aria-hidden="true"></i> : ""}</div>
				</div>
				<Form values={this.state.values} onSubmit={this.onSubmit}>
				<Text name={"groupName"} type={"dropdown"} label={"What is the group of your text document?"}  validate={['required']}
								options={groupOptions}/>
				<Text name={"name"} placeholder={"Text Document Name"} label={"What is the name of your text document?"}  validate={['required', 'name']}/>
				<Text name={"description"} placeholder={"Type here..."} label={"Describe your document here"} type={"textarea"}/>
				<Button action={"submit"} loading={this.state.loading} text="save"/>
				</Form>
				</div>
			)
		}
		
	}
}

function mapStateToProps(state, ownProps) {
	let selected = state.entities.ui.apiSummary.selectedEndpoint
	let subgroupType = ownProps.subgroupType
	let groups = state.entities.groups.byIds
	return {
		mode: selected ? 'Edit' : 'Create',
		selected,
		subgroupType,
		groups
	}
	// let selectedEndpoint = state.entities.ui.apiSummary.selectedEndpoint
	// let subgroupType = ownProps.subgroupType
	// if (subgroupType === 'endpoint' && state.entities.ui.apiSummary.createEndpoint 
	// 	|| subgroupType === 'schema' && state.entities.ui.apiSummary.createSchema) {
	// 	return {
	// 		endpoint: {},
	// 		subgroupType
	// 	}
	// }
	// let endpoint = (selectedEndpoint && state.entities.endpoints.byIds[selectedEndpoint])
	// return {
	// 	endpoint,
	// 	subgroupType
	// }
}

export default connect(mapStateToProps)(DocumentsEndpointCreate)