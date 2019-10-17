import React from 'react';
import Landing from '../components/landing'
import LandingForm from '../components/landingform'

const formValues = {
  enterRoom: {
    fieldType: 'text',
    fieldName: 'room',
    fieldPlaceholder: '123456',
    fieldMaxLength: 6,
    label: 'Enter your room number'
  },
  enterPass: {
    fieldType: 'password',
    fieldName: 'pass',
    fieldPlaceholder: 'hunter2',
    fieldMaxLength: 16,
    label: 'Enter your room\'s password'
  },
  enterTeam: {
    fieldType: 'text',
    fieldName: 'teamname',
    fieldPlaceholder: 'Aesop\'s Foibles',
    fieldMaxLength: 16,
    label: 'Enter your team name'
  }
}

export default function TeamApp(props) {
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