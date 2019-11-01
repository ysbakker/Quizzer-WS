import React from 'react'
import Logo from '../components/logo'

export default function Landing(props) {
  return <div className="team-landing">
    <Logo />
    {props.children}
  </div>
}