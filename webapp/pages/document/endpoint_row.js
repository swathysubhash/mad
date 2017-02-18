import Inferno from 'inferno'
import Component from 'inferno-component'
import { connect } from 'inferno-redux'


class EndpointRow extends Component {
	constructor(props){
		super(props)
		this.detail = this.detail.bind(this)
	}

	detail(subgroupType, event) {
		event.stopPropagation()
		this.context.store.dispatch({ type: 'ENDPOINT_SELECT', data: this.props.eId})
		this.context.router.push('/documents/' + this.props.apiId + '/editor/' + subgroupType + '/' + this.props.eId)
	}

	render() {
		const state = this.context.store.getState()
		const endpoint = state.entities.endpoints.byIds[this.props.eId]
		if (endpoint) {
			return (
				<li id={this.props.eId} className={this.props.selected === this.props.eId ? 'subgroup-select selected': 'subgroup-select'} onClick={this.detail.bind(this, endpoint.subgroupType)}>
					{endpoint.method ? <span className={"method " + endpoint.method}>{endpoint.method}</span> : ""}
					<span className={"name"}>{endpoint.name}</span>
				</li>
			);
		}
	}
}

export default connect(() => {})(EndpointRow)