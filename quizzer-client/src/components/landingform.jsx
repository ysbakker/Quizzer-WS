import React from 'react'

export default function LandingForm(props) {
  const { fieldType, fieldName, fieldPlaceholder, fieldMaxLength, label } = props.formData
  return <form className="landing-form">
    <label htmlFor={fieldName}>{label}</label>
    <input
      type={fieldType}
      id={fieldName}
      placeholder={fieldPlaceholder}
      maxLength={fieldMaxLength}
    />
    <button className="submit" onClick={(event) => {
      const el = document.querySelector(`#${fieldName}`)
      event.preventDefault()
      props.handleSubmit(el.value)
      el.value = ''
    }}>
      <img src="img/submit_arrow.svg" alt="Submit" />
    </button>
  </form >
}