import Inferno from 'inferno'
import Component from 'inferno-component'
import { connect } from 'inferno-redux'
import EndpointRow from './endpoint_row'

class GroupRow extends Component {
	constructor(props){
		super(props)
		this.detail = this.detail.bind(this)
	}

	detail(event) {
		event.stopPropagation()
		this.context.store.dispatch({ type: 'GROUP_SELECT', data: this.props.gId})
		this.context.router.push('/documents/' + this.props.apiId + '/editor/group/' + this.props.gId)
	}

	render() {
		const state = this.context.store.getState()
		const group = state.entities.groups.byIds[this.props.gId]
		return (
			<ul>
				<div onClick={this.detail}>{group.name}</div>
				{group.endpoints.map( e => <EndpointRow eId={e} apiId={this.props.apiId}/>)}
			</ul>
		);	
	}
}

export default connect(() => {})(GroupRow)