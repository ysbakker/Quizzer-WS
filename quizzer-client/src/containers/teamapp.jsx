import React from 'react';
import { connect } from 'react-redux'

import Landing from '../components/landing'
import LandingForm from '../components/landingform'
import { setError, setSuccess, showAlertBar } from '../components/alertbar'

import updateStatus from '../actions/updateStatus'
import updateRoomNumber from '../actions/updateRoomNumber'

/**************************
 ** All TeamApp statuses **
 **************************/

const ENTER_ROOM = 1
const ENTER_PASS = 2
const VERIFY_CREDENTIALS = 3
const ENTER_TEAM = 4
const VERIFY_TEAM_NAME = 5

const appStatusFlow = [
  ENTER_ROOM,
  ENTER_PASS,
  VERIFY_CREDENTIALS,
  ENTER_TEAM,
  VERIFY_TEAM_NAME
]

/********************
 ** WebSocket conf **
 ********************/

const socket = new WebSocket('ws://yorricks-macbook-pro-4.local:3000')

const sendStringToSocket = string => {
  socket.send(string)
}

const attachSocketListeners = props => {
  socket.onerror = event => {
    setError('Couldn\'t connect to server')
    showAlertBar()
    props.updateStatus(ENTER_ROOM)
  }

  socket.onclose = event => {
    setError('Connection closed by server')
    showAlertBar(5000)
    props.updateStatus(ENTER_ROOM)
  }

  socket.onmessage = event => {
    const msg = JSON.parse(event.data)

    switch (msg.mType) {
      case 'SUCCESS':
        // Emulate loading time
        setTimeout(() => {
          setSuccess(msg.message)
          showAlertBar(5000)
          props.updateStatus(getNextStatusInFlow(props.appState.status))
        }, 500)
        break
      case 'ERROR':
        // Emulate loading time
        setTimeout(() => {
          setError(msg.message)
          showAlertBar(5000)
          stateChangeOnError(msg.code, props.updateStatus)
        }, 500)
        break
      default:
        console.log('Message with unknown mType received:', msg)
        break
    }
  }
}

const stateChangeOnError = (code, statusUpdater) => {
  switch (code) {
    case 'INCORRECT PASS':
      statusUpdater(ENTER_PASS)
      break
    case 'NOT AUTHORIZED':
    case 'INCORRECT ROOM':
    default:
      statusUpdater(ENTER_ROOM)
      break
  }
}

const getNextStatusInFlow = (currentStatus) => {
  const i = appStatusFlow.indexOf(currentStatus)
  if (i === appStatusFlow.length - 1) return currentStatus
  else return appStatusFlow[i + 1]
}

// Form values dependent on current app status
const formValues = {
  [ENTER_ROOM]: {
    fieldType: 'text',
    fieldName: 'room',
    fieldPlaceholder: '123456',
    fieldMaxLength: 6,
    label: 'Enter your room number'
  },
  [ENTER_PASS]: {
    fieldType: 'password',
    fieldName: 'pass',
    fieldPlaceholder: 'hunter2',
    fieldMaxLength: 16,
    label: 'Enter your room\'s password'
  },
  [ENTER_TEAM]: {
    fieldType: 'text',
    fieldName: 'teamname',
    fieldPlaceholder: 'Aesop\'s Foibles',
    fieldMaxLength: 16,
    label: 'Enter your team name'
  }
}

/***********************
 ** TeamApp Component **
 ***********************/

function TeamApp(props) {
  const { appState } = props

  // Attach websocket event listeners here
  // so they can read from redux state and dispatch actions
  attachSocketListeners(props)

  // Determine the status of the app and render accordingly
  switch (appState.status) {
    case ENTER_ROOM: {
      return <Landing>
        <LandingForm
          formData={formValues[appState.status]}
          handleSubmit={(room) => {
            props.updateStatus(getNextStatusInFlow(appState.status))
            props.updateRoomNumber(room)
          }}
        />
      </Landing>
    }
    case ENTER_PASS: {
      return <Landing>
        <LandingForm
          formData={formValues[appState.status]}
          handleSubmit={(password) => {
            props.updateStatus(getNextStatusInFlow(appState.status))
            sendStringToSocket(JSON.stringify({
              mType: 'JOIN_ROOM',
              id: appState.currentRoomNumber,
              password: password
            }))
          }}
        />
      </Landing>
    }
    case VERIFY_CREDENTIALS: {
      return <Landing loading loadingMessage="Verifying credentials..." />
    }
    case ENTER_TEAM: {
      return <Landing>
        <LandingForm
          formData={formValues[appState.status]}
          handleSubmit={(team) => {
            props.updateStatus(getNextStatusInFlow(appState.status))
          }}
        />
      </Landing>
    }
    case VERIFY_TEAM_NAME: {
      return <Landing loading loadingMessage="Waiting for team name approval..." />
    }
    default: {
      return <Landing loading />
    }
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