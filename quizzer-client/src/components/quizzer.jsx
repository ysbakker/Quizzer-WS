import React from 'react'
import Landing from './landing'
import LandingForm from './landingform'

export default function Quizzer() {
  return <Landing>
    <h1 className="logo-text">Quizzer</h1>
    <LandingForm
      type="text"
      label="Enter your room number"
      input_name="room"
      input_placeholder="123456"
      input_maxLength="6"
    />
  </Landing>
}