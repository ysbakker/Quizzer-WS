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

    this.timer = setTimeout(() => {
      this.setState({
        show: false
      })
    }, 5000)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    const { success, message } = this.props
    return <div className={`alert-bar ${success ? 'success' : 'error'} ${this.state.show ? 'show' : ''}`}>
      <p>{message}</p>
    </div>
  }
}