import './codemirror.less'
import Inferno from 'inferno'
import Component from 'inferno-component'
import codemirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'

function normalizeLineEndings (str) {
	if (!str) return str;
	return str.replace(/\r\n|\r/g, '\n');
}

class CodeMirror extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isFocused : false
		}
		this.valueChanged = this.valueChanged.bind(this)
		// props - options, defaultValue, value, onFocusChange, onChange, path
	}
	componentDidMount() {
		this.codeMirror = codemirror.fromTextArea(this.textArea, this.props.options);
		this.codeMirror.on('change', this.valueChanged);
		this.codeMirror.on('focus', this.focusChanged.bind(this, true));
		this.codeMirror.on('blur', this.focusChanged.bind(this, false));
		this.codeMirror.setValue(this.props.defaultValue || this.props.value || '');
	}
	componentWillReceiveProps (nextProps) {
		if (this.codeMirror 
			&& nextProps.defaultValue !== undefined 
			&& normalizeLineEndings(this.codeMirror.getValue()) !== normalizeLineEndings(nextProps.defaultValue)) {
			this.codeMirror.setValue(nextProps.defaultValue);
		}
	}
	componentWillUnmount () {
		if (this.codeMirror) {
			this.codeMirror.toTextArea();
		}
	}
	focus () {
		if (this.codeMirror) {
			this.codeMirror.focus();
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
			this.props.onChange(doc.getValue(), change);
		}
	}
	render() {
		let cn = (this.state.isFocused ? 'cm-editor-focus ' : '') + 'cm-editor'
		return (
			<div className={cn}>
				<textarea ref={(input) => { this.textArea = input; }} name={this.props.path} defaultValue={this.props.value} autoComplete="off" />
			</div>
		)
	}
}

module.exports = CodeMirror;