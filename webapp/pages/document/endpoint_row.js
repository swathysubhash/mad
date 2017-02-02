import Inferno from 'inferno'
import Component from 'inferno-component'
import { connect } from 'inferno-redux'


class EndpointRow extends Component {
	constructor(props){
		super(props)
		this.detail = this.detail.bind(this)
	}

	detail(event) {
		event.stopPropagation()
		this.context.store.dispatch({ type: 'ENDPOINT_SELECT', data: this.props.eId})
		this.context.router.push('/documents/' + this.props.apiId + '/editor/endpoint/' + this.props.eId)
	}

	render() {
		const state = this.context.store.getState()
		const endpoint = state.entities.endpoints.byIds[this.props.eId]
		return (
			<li onClick={this.detail}>
				<span>{endpoint.name}</span>
				<span>{endpoint.method}</span>
			</li>
		);	
	}
}

export default connect(() => {})(EndpointRow)