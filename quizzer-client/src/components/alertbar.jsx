import React from 'react'

export default class AlertBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  componentDidMount() {
    this.showTimer = setTimeout(() => this.setState({
      show: true
    }), 50)

    this.hideTimer = setTimeout(() => this.setState({
      show: false
    }), 5000)
  }

  componentWillUnmount() {
    clearTimeout(this.showTimer)
    clearTimeout(this.hideTimer)
  }

  render() {
    const { success, message } = this.props
    return <div
      onClick={() => {
        this.setState({ show: false })
      }}
      className={`alert-bar ${success ? 'success' : 'error'} ${this.state.show ? 'show' : ''}`}>
      <p>{message}</p>
    </div>
  }
}