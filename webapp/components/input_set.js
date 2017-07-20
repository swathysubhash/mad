import './input_set.less'
import Inferno from 'inferno'
import Component from 'inferno-component'

class InputSet extends Component {
  constructor(props) {
    super(props)
    this.validations = []
    let valueSet = this.props.getValue(this.props.name) || []
    valueSet.length && (valueSet = valueSet.concat(this.copyOf(valueSet[0])))
    this.state = {
      valueSet,
      errors: []
    }

    this.getValue = this.getValue.bind(this)
    this.updateValue = this.updateValue.bind(this)
    this.onClick = this.onClick.bind(this)
    this.tabClick = this.tabClick.bind(this)
    this.deleteClick = this.deleteClick.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    let valueSet = nextProps.getValue(nextProps.name) || this.state.valueSet
    // valueSet.length && (valueSet = valueSet.concat(this.copyOf(valueSet[0])))
    // if (valueSet.length) {
    //   valueSet.push(this.copyOf(valueSet[0]))
    // }
    this.setState({
      valueSet
    })
  }

  copyOf(obj) {
    let copy = {};
    for(var prop in obj){
      copy[prop]= typeof obj[prop] === 'boolean' ? false: '';
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
    if (this.state.valueSet.length - 1 === row && !this.props.fixed) {
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

  tabClick(event) {
    let target = event.target;
    let tabItem = target.getAttribute('data-tab-item')
    let active = this.ref.querySelector('.active.tab-item')
    let activeTabHeader = this.ref.querySelector('.active.tab-header-item')
    let newActive = this.ref.querySelector('.tab-item.' + tabItem)
    if (active !== newActive) {
      active.classList.remove('active')
      activeTabHeader.classList.remove('active')
      target.classList.add('active')
      newActive.classList.add('active')
    }
  }

  render() {
    return (
      <div ref={(ref) => { this.ref = ref }} className={"input-set-group"}>
        {this.props.label ? <div className={"input-set-label"}>{this.props.label}</div>: ''}
        {this.props.tabs ? <div>{this.props.tabs.map((t, index) => (
          <div onClick={this.tabClick} className={index === 0 ? "tab-header-item active" : "tab-header-item"} data-tab-item={t}>{t}</div>
        ))}</div>: ''}
        {this.state.valueSet.map((v, index) => (
          <div className={this.props.tabs && this.props.tabs[index] ?  index === 0 ? "input-set tab-item active " + this.props.tabs[index] : "input-set tab-item "  + this.props.tabs[index] : "input-set"}>
            {this.props.children.map(child => Inferno.cloneVNode(child, {
                                                                      row: index,
                                                                      labels: false,
                                                                      showErrors: false,
                                                                      updateErrors: this.updateErrors.bind(this, index),
                                                                      onClick: this.onClick.bind(this, index),
                                                                      getValue: this.getValue.bind(this, index),
                                                                      updateValue: this.updateValue.bind(this, index),
                                                                    }
                                                                  ))}
            {this.state.valueSet.length - 1 !== index && !this.props.fixed 
                ? <button className={"secondary-btn"} onClick={this.deleteClick.bind(this, index)}>Delete</button> 
                : ''}
          </div>
        ))}
      </div>
    )
  }
}

export default InputSet