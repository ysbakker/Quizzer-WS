import React from 'react'

export default class AlertBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  componentDidMount() {
    this.setState({
      show: true
    })
    setTimeout(() => {
      this.setState({
        show: false
      })
    }, 5000)
  }

  render() {
    const { success, message } = this.props
    return <div className={`alert-bar ${success ? 'success' : 'error'} ${this.state.show ? 'show' : ''}`}>
      <p>{message}</p>
    </div>
  }
}