import React from 'react';
import Landing from '../components/landing'
import LandingForm from '../components/landingform'
import { setError, showAlertBar } from '../components/alertbar'

import updateStatus from '../actions/updateStatus'
import updateRoomNumber from '../actions/updateRoomNumber'

import { connect } from 'react-redux'

const socket = new WebSocket('ws://localhost:3000')

const appStatusFlow = [
  'enteringRoom',
  'enteringPass',
  'connecting',
  'enteringTeam',
  'verifyingTeam'
]

const getNextStatusInFlow = (currentStatus) => {
  const i = appStatusFlow.indexOf(currentStatus)
  if (i === appStatusFlow.length - 1) return currentStatus
  else return appStatusFlow[i + 1]
}

const formValues = {
  enteringRoom: {
    fieldType: 'text',
    fieldName: 'room',
    fieldPlaceholder: '123456',
    fieldMaxLength: 6,
    label: 'Enter your room number'
  },
  enteringPass: {
    fieldType: 'password',
    fieldName: 'pass',
    fieldPlaceholder: 'hunter2',
    fieldMaxLength: 16,
    label: 'Enter your room\'s password'
  },
  enteringTeam: {
    fieldType: 'text',
    fieldName: 'teamname',
    fieldPlaceholder: 'Aesop\'s Foibles',
    fieldMaxLength: 16,
    label: 'Enter your team name'
  }
}

function TeamApp(props) {
  socket.onerror = err => {
    setError('Couldn\'t connect to server!')
    showAlertBar()
  }
  switch (props.appState.status) {
    case 'enteringRoom':
      return <Landing>
        <LandingForm
          next={getNextStatusInFlow(props.appState.status)}
          formData={formValues[props.appState.status]}
          handleSubmit={(status, room) => {
            props.updateStatus(status)
            props.updateRoomNumber(room)
          }}
        />
      </Landing>
    case 'enteringPass':
      return <Landing>
        <LandingForm
          next={getNextStatusInFlow(props.appState.status)}
          formData={formValues[props.appState.status]}
          handleSubmit={(status, room) => {
            props.updateStatus(status)
          }}
        />
      </Landing>
    case 'enteringTeam':
    case 'connecting':
      return <Landing loading loadingMessage="Connecting to server..." />
    default:
      return <Landing loading />
  }
}

function mapStateToProps(state) {
  return {
    appState: state.appState
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateStatus: (status) => dispatch(updateStatus(status)),
    updateRoomNumber: (room) => dispatch(updateRoomNumber(room))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamApp)