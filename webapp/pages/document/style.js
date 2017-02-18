import './style.less'
import Inferno from 'inferno'
import Component from 'inferno-component'
import { connect } from 'inferno-redux'
import Form from '../../components/form'
import Button from '../../components/button'
import Text from '../../components/text'


class DocumentsStyle extends Component {
	constructor(props){
		super(props)
	}

	render() {
		return (
			<div className={"docs-style"}>
				<div className={"form-header"}>Documentation Style</div>
				<Form values={this.props.style} onSubmit={this.onSubmit}>
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
						<Text type={"color"} name={"orgNameFontColor"} label={"Font color for ORG name"} />
						<Text type={"color"} name={"orgApiStringFontColor"} label={"Font color for rest of ORG name section"} />
						<Button action={"submit"} loading={this.state.isLoading} text="save"/>
					</Form>
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
	let api = state.entities.apis.byIds[ownProps.params.documentId]
	let style = {
		column: 3,
		object: "style",
		linkColor: "#131313",
		fontSize: 14,
		headerBackgroundColor: "#F7F7F7",
		headerFontColor: "#44492A",
		sidePanelBackgroundColor: "#FAFCFC",
		sidePanelFontColor: "#676F73",
		sidePanelLightFontColor: "#9AA4AA",
		sidePanelSecondaryFontColor: "#11A0E7",
		leftPanelBackgroundColor: "#FFFFFF",
		leftPanelFontColor: "#4C555A",
		leftPanelLightFontColor: "#959FA5",
		leftPanelHighlightFontColor: "#BC4671",
		leftPanelHighlightBackgroundColor: "#FAFCFC",
		rightPanelBackgroundColor: "#2D3134",
		rightPanelFontColor: "#CACFD1",
		codeFontColor: "#B7B8B8",
		codeHighlightColor: "#9DC158",
		codeBackgroundColor: "#272B2D",
		orgNameFontColor: "#32325D",
		orgApiStringFontColor: "#0199E5"
	}
	if (api && api.style) {
		style = api.style
	}
	return {
		style
	}
} 

export default connect(mapStateToProps)(DocumentsStyle)