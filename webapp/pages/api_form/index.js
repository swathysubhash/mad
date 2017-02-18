import './index.less'
import Inferno from 'inferno'
import Component from 'inferno-component'
import { Link } from 'inferno-router'
import { createApi } from '../../actions/api'
import FormInput from '../../components/form_input'
import FormButton from '../../components/form_button'

import Form from '../../components/form'
import Text from '../../components/text'
import Button from '../../components/button'

class ApiForm extends Component {
	constructor(props){
		super(props)
		this.state = {
			loading: false,
			values: {
				name: '',
				description: '',
				version: '',
				protocol: 'http',
				host: ''
			}
		}

		this.isLoading = this.isLoading.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	onSubmit(values) {
		console.log(values)

		// this.context.router.push('/editor')
		event.preventDefault()

		// let formData = this.state.formData
		// let fields = Object.keys(formData)
		// let submitData = {}


		// for(let i=0; i < fields.length; i++) {
		// 	let field = fields[i]
		// 	this._validate(field, formData[field].value)
		// 	if (formData[field] && formData[field].error) return
		// 	submitData[field] = formData[field].value
		// }	
/***************************************/
		// const store = this.context.store
		// const state = store.getState()

		this.setState({ loading: true })
		createApi(values)
		.then(res => {
			this.setState({ loading: false })
			// this.context.router.push('/documents/')
			this.context.router.push('/documents/'+ res.data.id +'/editor')
			// store.dispatch({ type: 'CREATE_API_SUCCESS', data: res.data})
		})
		.catch(err => {
			this.setState({ loading: false })
			// store.dispatch({ type: 'CREATE_API_FAILURE', data: err.response.data})
		})



	}


	isLoading() {
		return this.state.loading
	}

	render() {
		console.log("APIFORM")
		return (
			<div>
				<div class="context">
					<div class="middle">
						<div>
							<Link className="bread-el" to={"/"}>
							<span>Api Document List</span>
							<span><i class="fa fa-angle-right" aria-hidden="true"></i></span>
							</Link>
							<span>Create Api Document</span></div>	
					</div>
				</div>
				<div class="middle">
					<div className={"form-header"}>Create API Document</div>
					<div>
						<div>
							<Form values={this.state.values} onSubmit={this.onSubmit}>
								<Text name={"name"} placeholder={"Api Name"} label={"What is the name of your Api?"}  validate={['required', 'name']}/>
								<Text name={"description"} placeholder={"Group Description"} label={"Provide some description of your api?"} type={"textarea"}/>
								<Text name={"version"} placeholder={"Api Version"} label={"What is the version of your Api?"}  validate={['required', 'version']}/>
								<Text name={"protocol"} placeholder={"Api Protocol"} label={"What is the protocol of your Api?"}  validate={['required']}/>
								<Text name={"host"} placeholder={"api.myntra.com"} label={"What is the hostname of your Api?"}  validate={['required']}/>
								<Button className={"btn-primary"} action={"submit"} loading={this.state.isLoading} text="create"/>
							</Form>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default ApiForm