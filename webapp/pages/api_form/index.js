import Inferno from 'inferno'
import Component from 'inferno-component'
import { createApi } from '../../actions/api'
import FormInput from '../../components/form_input'
import FormButton from '../../components/form_button'

class ApiForm extends Component {
	constructor(props){
		super(props)

		this.state = {
			loading: false,
			mode: this.props.mode || 'create',
			formData : {
				name: {
					value: "",
					errorMessage: "Name should not be empty",
					error: false
				},
				description: {
					value: "",
					errorMessage: "Description should not be empty",
					error: false
				},
				version: {
					value: "",
					errorMessage: "Version should not be empty",
					error: false
				},
				protocol: {
					value: "",
					errorMessage: "Protocol should not be empty",
					error: false
				},
				host: {
					value: "",
					errorMessage: "Host should not be empty",
					error: false
				}
			}
		}

		this.isLoading = this.isLoading.bind(this)
		this.fieldData = this.fieldData.bind(this)
		this.submit = this.submit.bind(this)
		this.validate = this.validate.bind(this)
		this.cancel = this.cancel.bind(this)
	}

	submit(event) {
		event.preventDefault()

		let fields = Object.keys(this.state.formData)

		for(let i=0; i < fields.length; i++) {
			if (this.state.formData[fields[i]] && this.state.formData[fields[i]].error)
				return
		}

		const store = this.context.store
		const state = store.getState()

		this.setState({ loading: true })
		createApi(this.state.form)
		.then(res => {
			this.setState({ loading: false })
			// store.dispatch({ type: 'CREATE_API_SUCCESS', data: res.data})
		})
		.catch(err => {
			setTimeout(() => this.setState({ loading: false }), 5000)
			
			// store.dispatch({ type: 'CREATE_API_FAILURE', data: err.response.data})
		})



	}

	validate() {
		console.log('Args', arguments)
		return true
	}

	cancel() {
		console.log("Canceling")
		return true
	}

	fieldData(f) {
		return this.state.formData[f]
	}

	isLoading() {
		return this.state.loading
	}

	render() {
		return (
			<div>
				<div>Create API</div>
				<div>
					<FormInput placeholder={"eg: Mad Api"} label={"Name"}
								data={this.fieldData.bind(this, "name")} validate={this.validate.bind(this, "name")}/>
					<FormInput placeholder={"eg: Not Mad"} label={"Description"}
								data={this.fieldData.bind(this, "description")} validate={this.validate.bind(this, "description")} type="textarea"/>
					<FormInput placeholder={"eg: v1"} label={"Version"}
								data={this.fieldData.bind(this, "version")} validate={this.validate.bind(this, "version")}/>
					<FormInput placeholder={"eg: http"} label={"Protocol"}
								data={this.fieldData.bind(this, "protocol")} validate={this.validate.bind(this, "protocol")}/>
					<FormInput placeholder={"eg: api.mad.com"} label={"Host"}
								data={this.fieldData.bind(this, "host")} validate={this.validate.bind(this, "host")}/>
				</div>
				<div>
					<FormButton onClick={this.submit} type={"primary"} loading={this.isLoading} text="save"/>
					<FormButton onClick={this.cancel} type={"secondary"} loading={() => false} text="cancel"/>
				</div>
			</div>
		)
	}

	// createApiOnClick(event) {
	// 	event.preventDefault()

	// 	const store = this.context.store
	// 	const state = store.getState()

	// 	store.dispatch({ type: 'CREATE_API_REQUEST' })
	// 	createApi(this.state.form)
	// 	.then(res => store.dispatch({ type: 'CREATE_API_SUCCESS', data: res.data}))
	// 	.catch(err => store.dispatch({ type: 'CREATE_API_FAILURE', data: err.response.data}))
	// }


	// render() {
	// 	const state = this.context.store.getState()
	// 	return (
	// 		<div>
	// 			<div>ApiList</div>
	// 			<button onClick={ this.createApiOnClick }>New</button>
	// 		</div>
	// 	);
	// }
}

export default ApiForm