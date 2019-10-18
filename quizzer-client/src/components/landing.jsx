import React from 'react'
import Logo from '../components/logo'
import LoadingSpinner from '../components/loadingspinner'

export default function Landing(props) {
  if (props.loading) return <div className="team-landing">
    <Logo />
    <LoadingSpinner
      text={props.loadingMessage !== undefined ? props.loadingMessage : "Waiting..."}
    />
    {props.children}
  </div>
  return <div className="team-landing">
    <Logo />
    {props.children}
  </div>
}