import Inferno from 'inferno'
import Component from 'inferno-component'
import { Link } from 'inferno-router'
import ButtonMenu from '../../components/button_menu'
import ButtonMenuItem from '../../components/button_menu_item'

class DocumentsEditorOverview extends Component {
	constructor(props){
		super(props)
	}

	render() {
		let dId = this.props.params.documentId
		// let groupCreate = `/documents/${dId}/editor/group/create`
		return (
			<div>
			</div>
		);
	}
}

export default DocumentsEditorOverview