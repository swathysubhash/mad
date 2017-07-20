import Inferno from 'inferno'
import Component from 'inferno-component'
import { deleteApi } from '../../actions/api'


class DocumentsSettings extends Component {
	constructor(props){
		super(props)
		this.deleteApiOnClick = this.deleteApiOnClick.bind(this)
	}

	deleteApiOnClick(documentId) {
		deleteApi({id: documentId})
		.then(res => {
			window.location="/"
		})
		.catch(err => {
			this.context.store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'danger', message: err.response.data && err.response.data.message }	})
		})
	}

	render() {
		return (
			<div className={"docs-style"}>
				<div className={"form-header"}>Documentation Settings</div>
				<div>
					<span>Delete this api document ? </span>
					<button className={"btn-primary"} onClick={this.deleteApiOnClick.bind(this, this.props.params && this.props.params.documentId)}>Delete</button>
				</div>
			</div>
		);
	}
}

export default DocumentsSettings