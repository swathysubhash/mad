import './index.less'

import Inferno from 'inferno'
import Component from 'inferno-component'
import { Link } from 'inferno-router'
import { getApiList } from '../../actions/api'
import ApiForm from '../api_form/index'
import { convertEpoch } from '../../helpers/util'
import { connect } from 'inferno-redux'


class DocumentList extends Component {
	constructor(props){
		super(props)
		this.createApiOnClick = this.createApiOnClick.bind(this)
		this.allOnClick = this.allOnClick.bind(this)
		this.byMeOnClick = this.byMeOnClick.bind(this)
	}

	createApiOnClick(){
		this.context.router.push('/documentlist/create')	
	}
	allOnClick(){
		this.context.router.push('/documentlist/list')	
	}
	byMeOnClick(){
		this.context.router.push('/documentlist/byme')	
	}

	render() {
		const state = this.context.store.getState()
		const apis = state.entities.apis.byIds
		const apiIds = Object.keys(apis)
		return (
			<div>
				<div class="context">
					<div class="middle">
						<div>
							<Link className="bread-el" to={"/"}>
							<span>Api Document List</span>
							</Link>
						</div>
					</div>
				</div>
				<div className={"middle api-list"} >
					<div className={"left"}>
						<button className={this.props.children && this.props.children.props.path == "/create" ? "selected" : ""} onClick={ this.createApiOnClick }><i class="fa fa-plus" aria-hidden="true"></i>Create Api Document</button>
						<button className={this.props.children && ( this.props.children.props.path == "/list" || this.props.children.props.path == "/" ) ? "selected" : ""} onClick={ this.allOnClick }><i class="fa fa-files-o" aria-hidden="true"></i>All Documents</button>
						<button className={this.props.children && this.props.children.props.path == "/byme" ? "selected" : ""} onClick={ this.byMeOnClick }><i class="fa fa-user" aria-hidden="true"></i>
Created by you</button>
					</div>
					<div className={"right"}>
						{this.props.children}		
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		...state,
		...ownProps
	}
}

export default connect(mapStateToProps)(DocumentList)