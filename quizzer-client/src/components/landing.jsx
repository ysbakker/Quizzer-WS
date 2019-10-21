import React from 'react'
import Logo from '../components/logo'
import LoadingSpinner from '../components/loadingspinner'

export default function Landing(props) {
  return <div className="team-landing">
    <Logo />
    {props.loading
      ? <LoadingSpinner
        text={props.loadingMessage !== undefined && props.loadingMessage !== null
          ? props.loadingMessage
          : "Waiting..."}
      />
      : props.children}
  </div>
}