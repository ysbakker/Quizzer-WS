import React from 'react'

export default class LandingForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
      message: null
    }
  }

  validate = (value) => {
    const { props } = this
    const { validation } = props.formData
    if (validation === undefined) return true

    let messages = []

    if (validation.min && value.toString().length < validation.min) messages.push(`Input must be at least ${validation.min} characters long`)
    if (validation.max && value.toString().length > validation.max) messages.push(`Input must be less than ${validation.max} characters long`)
    if (validation.len && value.toString().length !== validation.len) messages.push(`Input must be ${validation.len} characters long`)

    return messages.length === 0 || messages
  }

  render() {
    const { props, state } = this
    const { fieldType, fieldName, fieldPlaceholder, fieldMaxLength, label } = props.formData
    return <form className={`landing-form${state.error === true ? ' error' : ''}`}>
      <label className="form-label" htmlFor={fieldName}>{label}</label>
      <input
        type={fieldType}
        id={fieldName}
        placeholder={fieldPlaceholder}
        maxLength={fieldMaxLength}
        pattern={fieldName === 'room' ? '\\d*' : ''}
      />
      <div className="error-message">
        <p><strong>Please check your input!</strong></p>
        <ul>{state.message === null
          ? null
          : state.message.map(msg => <li key="msg">{msg}</li>)}
        </ul>
      </div>
      <input type="image" src="/img/submit_arrow.svg" alt="Submit" className="submit" onClick={(event) => {
        event.preventDefault()
        const el = document.querySelector(`#${fieldName}`)
        const valid = this.validate(el.value)
        if (valid !== true) {
          this.setState({
            error: true,
            message: valid
          })
          return
        }
        this.setState({ error: false })
        props.handleSubmit(el.value)
        el.value = ''
      }} />
    </form >
  }
}