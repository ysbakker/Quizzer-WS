import React from 'react'

export default function LandingForm(props) {
  return <form className="landing-form">
    <label htmlFor={props.input_name}>{props.label}</label>
    <input
      type={props.type}
      id={props.input_name}
      placeholder={props.input_placeholder}
      maxLength={props.input_maxLength}
    />
    <button className="submit">
      <img src="img/submit_arrow.svg" alt="Submit" />
    </button>
  </form >
}