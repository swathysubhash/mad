import Inferno from 'inferno'
import Component from 'inferno-component'

class Form extends Component {
  constructor(props) {
    super(props)
    this.validations = []
    this.state = {
      values: this.props.values
    }
    this.submit = this.submit.bind(this)
    this.getValue = this.getValue.bind(this)
    this.updateValue = this.updateValue.bind(this)
    this.registerValidation = this.registerValidation.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props === nextProps) return
    this.setState({
      values: nextProps.values
    })
  }

  registerValidation(isValidFunc) {
    this.validations = [...this.validations, isValidFunc];
    return this.removeValidation.bind(this, isValidFunc);
  }

  removeValidation(ref) {
    this.validations = this.validations.filter(v => v != ref);
  }
  
  isFormValid() {
    return this.validations.reduce((memo, isValidFunc) => 
      isValidFunc() && memo, true);
  }

  updateValue(name, value) {
    this.setStateSync({
      values: {
        ...this.state.values,
        ...{ [name] : value }
      }
    })
  }

  getValue(name) {
    return this.state.values[name]
  }

  submit(){
    if (this.isFormValid()) {
      this.props.onSubmit(this.state.values);
      this.props.reset && this.props.reset();
    }
  }

  render() {
    return (
      <div class="form">
        {this.props.children.map(child => Inferno.cloneVNode(child, { 
                                                                      onSubmit: this.submit,
                                                                      getValue: this.getValue,
                                                                      updateValue: this.updateValue,
                                                                      registerValidation: this.registerValidation 
                                                                    }))}
      </div>
    )
  }
}

export default Form