import Inferno from 'inferno'
import Component from 'inferno-component'
import { connect } from 'inferno-redux'
import EndpointRow from './endpoint_row'
import dragula from 'dragula'

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

	componentDidMount() {
		if (!this.subgroupHandle.dragHandler) {
			dragula([this.subgroupHandle]).on('drop', function(){console.log(arguments)})	
		}
		this.subgroupHandle.dragHandler = true
	}


	componentDidUpdate() {
		if (!this.subgroupHandle.dragHandler) {
			dragula([this.subgroupHandle]).on('drop', function(){console.log(arguments)})	
		}
		this.subgroupHandle.dragHandler = true
	}


	render() {
		const state = this.context.store.getState()
		const group = state.entities.groups.byIds[this.props.gId]
		return (
			<div id={this.props.gId} className={"summary-group-row"}>
				<div className={this.props.selected === this.props.gId ? 'selected group-select': 'group-select'} onClick={this.detail}>{group.name}</div>
				<div className={"summary-subgroup-row"} ref={(handle) => { this.subgroupHandle = handle }}>
					{group.endpoints.map( e => <EndpointRow eId={e} selected={this.props.selected} apiId={this.props.apiId}/>)}
				</div>
			</div>
		);	
	}
}

export default connect(() => {})(GroupRow)