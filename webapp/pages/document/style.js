import './style.less'
import Inferno from 'inferno'
import Component from 'inferno-component'
import { connect } from 'inferno-redux'
import Form from '../../components/form'
import Button from '../../components/button'
import Text from '../../components/text'
import { getStyle, updateStyle } from '../../actions/style'

const DEFAULT_STYLE = {
	brandImageLink: '',
	brandImageUrl: '',
	column: '',
	object: '',
	linkColor: '',
	fontSize: '',
	headerBackgroundColor: '',
	headerFontColor: '',
	sidePanelBackgroundColor: '',
	sidePanelFontColor: '',
	sidePanelLightFontColor: '',
	sidePanelSecondaryFontColor: '',
	leftPanelBackgroundColor: '',
	leftPanelFontColor: '',
	leftPanelLightFontColor: '',
	leftPanelHighlightFontColor: '',
	leftPanelHighlightBackgroundColor: '',
	rightPanelBackgroundColor: '',
	rightPanelFontColor: '',
	codeFontColor: '',
	codeHighlightColor: '',
	codeBackgroundColor: '',
}

class DocumentsStyle extends Component {
	constructor(props){
		super(props)
		this.state = {
			loading: false,
			values: DEFAULT_STYLE,
		}
		this.onSubmit = this.onSubmit.bind(this)
	}

	fetchStyle(documentId) {
		this.setState({ loading: true })
		getStyle({ documentId })
		.then(res => {
			this.setState({ loading: false, values: res.data })
		})
		.catch(err => {
			this.setState({ loading: false })
			this.context.store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'danger', message: err.response.data }	})
		})
	}

	componentDidMount() {
		this.fetchStyle(this.props.documentId)
	}

	componentWillReceiveProps(nextProps) {
		this.fetchStyle(nextProps.documentId)
	}

	onSubmit(values) {
		this.setState({ loading: true })
		updateStyle({documentId: this.props.documentId, ...values})
		.then(res => {
			this.setState({ loading: false, values: res.data })
			this.context.store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'success', message: 'Styles updated successfully.' }})
		})
		.catch(err => {
			this.setState({ loading: false })
			this.context.store.dispatch({ type: 'SET_NOTIFICATION', data: { type: 'danger', message: err.response.data }	})
		})
	}

	render() {
		return (
			<div className={"docs-style"}>
				<div className={"form-header"}>Documentation Style</div>
				<Form values={this.state.values} onSubmit={this.onSubmit}>
						<Text name={"brandImageUrl"} label={"Url of brand image"} />
						<Text name={"brandImageLink"} label={"Link for the brand image"} />
						<Text name={"column"} label={"No of columns? 2 or 3"} />
						<Text type={"color"} name={"linkColor"} label={"Color of the links"} />
						<Text name={"fontSize"} label={"Size of the font"} />
						<Text type={"color"} name={"headerBackgroundColor"} label={"Background color of header"} />
						<Text type={"color"} name={"headerFontColor"} label={"Font color of header"} />
						<Text type={"color"} name={"sidePanelBackgroundColor"} label={"Background color of side nav"} />
						<Text type={"color"} name={"sidePanelFontColor"} label={"Font color of side nav"} />
						<Text type={"color"} name={"sidePanelLightFontColor"} label={"Lighter font color of side nav"} />
						<Text type={"color"} name={"sidePanelSecondaryFontColor"} label={"Highlight color of side nav"} />
						<Text type={"color"} name={"leftPanelBackgroundColor"} label={"Background color of left panel"} />
						<Text type={"color"} name={"leftPanelFontColor"} label={"Font color of left panel"} />
						<Text type={"color"} name={"leftPanelLightFontColor"} label={"Lighter font color of left panel"} />
						<Text type={"color"} name={"leftPanelHighlightFontColor"} label={"Highlight font color of left panel"} />
						<Text type={"color"} name={"leftPanelHighlightBackgroundColor"} label={"Highlight background color of left panel"} />
						<Text type={"color"} name={"rightPanelBackgroundColor"} label={"Background color of right panel"} />
						<Text type={"color"} name={"rightPanelFontColor"} label={"Font color of right panel"} />
						<Text type={"color"} name={"codeFontColor"} label={"Font color for code text"} />
						<Text type={"color"} name={"codeHighlightColor"} label={"Highlight color of code text"} />
						<Text type={"color"} name={"codeBackgroundColor"} label={"Backgroudn color of code text"} />
						<Button action={"submit"} loading={this.state.isLoading} text="save"/>
					</Form>
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		documentId: ownProps.params.documentId
	}
} 

export default connect(mapStateToProps)(DocumentsStyle)