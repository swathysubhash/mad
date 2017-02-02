import './input_set.less'
import Inferno from 'inferno'
import Component from 'inferno-component'

class InputSet extends Component {
  constructor(props) {
    super(props)
    this.validations = []
    let valueSet = this.props.getValue(this.props.name)
    // valueSet.push(this.copyOf(valueSet[0]))
    
    this.state = {
      valueSet,
      errors: []
    }

    this.getValue = this.getValue.bind(this)
    this.updateValue = this.updateValue.bind(this)
    this.onClick = this.onClick.bind(this)
    this.deleteClick = this.deleteClick.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      valueSet: nextProps.getValue(nextProps.name)
    })
  }

  copyOf(obj) {
    let copy = {};
    for(var prop in obj){
      copy[prop]= '';
    }
    return copy;
  }
  
  isInputSetValid() {
    return true;
  }

  updateValue(row, name, value) {
    let valueSet = [ ...this.state.valueSet ]
    valueSet[row][name] = value
    this.setState({
      valueSet
    })
    this.props.updateValue && this.props.updateValue(this.props.name, valueSet)
  }

  updateErrors(row, name, errors) {
    this.setState({
      error: errors ? { value: errors, row: row }: ''
    })
  }

  onClick(row) {
    if (this.state.valueSet.length - 1 === row) {
      this.setState({
        valueSet: [ ...this.state.valueSet, this.copyOf(this.state.valueSet[0]) ]
      })
    }
  }

  deleteClick(row) {
    this.setState({
      valueSet: [...this.state.valueSet.slice(0,row).concat(this.state.valueSet.slice(row + 1))]
    })
  }

  getValue(row, name) {
    return this.state.valueSet[row][name]
  }

  render() {
    return (
      <div class="input-set-group">
        {this.props.label ? <div class="input-set-label">{this.props.label}</div>: ''}
        {this.state.valueSet.map((v, index) => (
          <div class="input-set">
            {this.props.children.map(child => Inferno.cloneVNode(child, { 
                                                                      labels: false,
                                                                      showErrors: false,
                                                                      updateErrors: this.updateErrors.bind(this, index),
                                                                      onClick: this.onClick.bind(this, index),
                                                                      getValue: this.getValue.bind(this, index),
                                                                      updateValue: this.updateValue.bind(this, index),
                                                                    }
                                                                  ))}
            {this.state.valueSet.length - 1 !== index 
                ? <button onClick={this.deleteClick.bind(this, index)}>Delete</button> 
                : ''}
          </div>
        ))}
      </div>
    )
  }
}

export default InputSet