
import Inferno from 'inferno'
import Component from 'inferno-component'
import Dropdown from './dropdown'


class ObjectEditor extends Component {
	constructor(props) {
		super(props)
		this.types = ['string', 'int', 'bool', 'object', 'array']
		this.arrayTypes = ['string array', 'int array', 'bool array', 'object array', 'array of array']
		this.state = {
			root : {}
		}
		this.selectRoot = this.selectRoot.bind(this)
		this.renderObject = this.renderObject.bind(this)
		this.renderSimple = this.renderSimple.bind(this)
		this.renderArray = this.renderArray.bind(this)
	}

	getMethod(type) {
		switch (type) {
			case 'object': return 'renderObject'
			case 'string':
			case 'int':
			case 'bool': return 'renderSimple'
			case 'array':	return 'renderArray'
		}
	}

	selectRoot({ value }) {
		this.setState({
			root: {
				type: value,
				key: '',
				props: []
			}
		})
	}

	renderArray(r) {
		return (
			<div>
				<div>key: <input type='text' value={r.key}></input></div>
				{r.props.forEach(p => this[this.getMethod(p.type)](p))}
			</div>
		)
	}

	renderSimple(r) {
		return (
			<div>
				<div>key: <input type='text' value={r.key}></input></div>
				<div>value: <input type='text' value={r.value}></input></div>
			</div>
		)
	}

	renderObject(r) {
		return 
			(<div>
				<div>key: <input type='text' value={r.key}></input></div>
				{r.props.forEach(p => this[this.getMethod(p.type)](p))}
			</div>)
		
	}

	render() {
		let root = this.state.root
		return (
				<div>
					<div>
						<span>Select Type</span>
						<Dropdown options={[
								{label: 'string', value: 'string'}, 
								{label: 'int', value: 'int'},
								{label: 'bool', value: 'bool'},
								{label: 'object', value: 'object'},
								{label: 'array', value: 'array'}
							]}
							onChange={this.selectRoot}/>
					</div>
					<div>
						{root.type ? this[this.getMethod(root.type)](root) : ''}
					</div>
				</div>
			)
	}
}

export default ObjectEditor