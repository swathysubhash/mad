import './markdown_editor.less'
import Inferno from 'inferno'
import Component from 'inferno-component'
import SimpleMDE from 'simplemde'

function normalizeLineEndings (str) {
	if (!str) return str;
	return str.replace(/\r\n|\r/g, '\n');
}

class MarkdownEditor extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isFocused : false
		}
		this.valueChanged = this.valueChanged.bind(this)
		// props - options, defaultValue, value, onFocusChange, onChange, path
	}
	componentDidMount() {
		this.simplemde = new SimpleMDE({
			...{ 
				element: this.textArea, 
				hideIcons: ['guide'], 
				status: false,
				placeholder: "Type here...", 
				showIcons: ["code", "table"],
			},
			...this.props.options
		});
		this.simplemde.codemirror.on('change', this.valueChanged);
		this.simplemde.codemirror.on('focus', this.focusChanged.bind(this, true));
		this.simplemde.codemirror.on('blur', this.focusChanged.bind(this, false));
		this.simplemde.value(this.props.defaultValue || this.props.value || '');
		setTimeout(() => {
			this.simplemde.codemirror.refresh();
		},1);
	}
	componentWillReceiveProps (nextProps) {
		if (this.simplemde.isPreviewActive()) {
			this.simplemde.togglePreview()
		}
		if (this.simplemde 
			&& nextProps.value !== undefined 
			&& normalizeLineEndings(this.simplemde.value()) !== normalizeLineEndings(nextProps.value)) {
			this.simplemde.value(nextProps.value);
			setTimeout(() => {
				this.simplemde.codemirror.refresh();
			},1);
		}
	}
	componentWillUnmount () {
		if (this.simplemde) {
			this.simplemde.toTextArea();
		}
	}
	focus () {
		if (this.simplemde) {
			this.simplemde.focus();
		}
	}
	focusChanged (focused) {
		this.setState({
			isFocused: focused,
		});
		this.props.onFocusChange && this.props.onFocusChange(focused);
	}
	valueChanged (doc, change) {
		if (this.props.onChange && change.origin !== 'setValue') {
			this.props.onChange(doc.getValue(), change)
		}
	}
	render() {
		let md = (this.state.isFocused ? 'markdown-editor-focus ' : '') + 'markdown-editor'
		return (
			<div className={md}>
				<textarea ref={(input) => { this.textArea = input; }} name={this.props.path} defaultValue={this.props.value} autoComplete="off" />
			</div>
		)
	}
}

export default MarkdownEditor