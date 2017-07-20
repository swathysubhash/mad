import Inferno from 'inferno'
import Component from 'inferno-component'
import { Link } from 'inferno-router'
import { createApi } from '../../actions/api'
import FormInput from '../../components/form_input'
import FormButton from '../../components/form_button'
import { renderMarkdown } from '../../helpers/util'

import Form from '../../components/form'
import Text from '../../components/text'
import Button from '../../components/button'

class CreateDocument extends Component {
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
		values = {
			...values,
			...{ descriptionHTML: renderMarkdown(values.description) }
		}
		event.preventDefault()
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
		return (
			<div>
					<div className={"form-header"}>Create API Document</div>
					<div>
						<div>
							<Form values={this.state.values} onSubmit={this.onSubmit}>
								<Text name={"name"} placeholder={"Api Name"} label={"What is the name of your Api?"}  validate={['required', 'name']}/>
								<Text name={"description"} placeholder={"Api Description"} label={"Provide some description of your api?"} type={"textarea"}/>
								<Text name={"version"} placeholder={"Eg: v1"} label={"What is the version of your Api? Should start with 'v'"}  validate={['required', 'version']}/>
								<Text name={"protocol"} placeholder={"Api Protocol"} label={"What is the protocol of your Api?"}  validate={['required']}/>
								<Text name={"host"} placeholder={"api.myntra.com"} label={"What is the hostname of your Api?"}  validate={['required']}/>
								<Button className={"btn-primary"} action={"submit"} loading={this.state.isLoading} text="create"/>
							</Form>
						</div>
				</div>
			</div>
		)
	}
}

export default CreateDocument