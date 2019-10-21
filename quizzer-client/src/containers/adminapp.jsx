import React from 'react';
import { connect } from 'react-redux'

import Landing from '../components/landing'
import LandingForm from '../components/landingform'
import { setError, setSuccess, showAlertBar } from '../components/alertbar'

import updateStatus from '../actions/updateStatus'
import updateRoomName from '../actions/updateRoomName'

/***************************
 ** All AdminApp statuses **
 ***************************/

const ENTER_NAME = 1
const ENTER_PASS = 2

const appStatusFlow = [
  ENTER_NAME,
  ENTER_PASS
]

/********************
 ** WebSocket conf **
 ********************/

const socket = new WebSocket('ws://yorricks-macbook-pro-4.local:3000')

const sendStringToSocket = string => {
  socket.send(string)
}

const attachSocketListeners = props => {
  socket.onopen = () => {
    sendStringToSocket(JSON.stringify({
      mType: 'GENERATE_ROOM'
    }))
  }

  socket.onerror = event => {
    setError('Couldn\'t connect to server')
    showAlertBar()
    props.updateStatus(ENTER_NAME)
  }

  socket.onclose = event => {
    setError('Connection closed by server')
    showAlertBar(5000)
    props.updateStatus(ENTER_NAME)
  }

  socket.onmessage = event => {
    const msg = JSON.parse(event.data)

    switch (msg.mType) {
      case 'SUCCESS':
        setSuccess(msg.message)
        showAlertBar(5000)
        props.updateStatus(getNextStatusInFlow(props.appState.status))
        break
      case 'ERROR':
        setError(msg.message)
        showAlertBar(5000)
        stateChangeOnError(msg.code, props.updateStatus)
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
  }
}

const getNextStatusInFlow = (currentStatus) => {
  const i = appStatusFlow.indexOf(currentStatus)
  if (i === appStatusFlow.length - 1) return currentStatus
  else return appStatusFlow[i + 1]
}

// Form values dependent on current app status
const formValues = {
  [ENTER_NAME]: {
    fieldType: 'text',
    fieldName: 'name',
    fieldPlaceholder: 'The Liberty Well',
    fieldMaxLength: 16,
    label: 'Enter an interesting room name'
  },
  [ENTER_PASS]: {
    fieldType: 'password',
    fieldName: 'pass',
    fieldPlaceholder: 'welcome123',
    fieldMaxLength: 16,
    label: 'Enter a password for your room'
  }
}

/************************
 ** AdminApp Component **
 ************************/

function AdminApp(props) {
  const { appState } = props

  // Attach websocket event listeners here
  // so they can read from redux state and dispatch actions
  attachSocketListeners(props)

  // Determine the status of the app and render accordingly
  switch (appState.status) {
    case ENTER_NAME: {
      return <Landing>
        <LandingForm
          formData={formValues[appState.status]}
          handleSubmit={(name) => {
            props.updateStatus(getNextStatusInFlow(appState.status))
            props.updateRoomName(name)
            sendStringToSocket(JSON.stringify({
              mType: 'SET_NAME',
              name: name
            }))
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
              mType: 'SET_PASSWORD',
              password: password
            }))
          }}
        />
      </Landing>
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
    updateRoomName: (name) => dispatch(updateRoomName(name))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminApp)