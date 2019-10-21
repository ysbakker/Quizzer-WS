import React from 'react';
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router'

import Landing from '../components/landing'
import LandingForm from '../components/landingform'
import { setError, setSuccess, showAlertBar } from '../components/alertbar'

import updateStatus from '../actions/updateStatus'
import updateRoomNumber from '../actions/updateRoomNumber'
import updateAfterLoadingStatus from '../actions/updateAfterLoadingStatus'
import updateLoadingMessage from '../actions/updateLoadingMessage'

/********************
 ** WebSocket conf **
 ********************/

const socket = new WebSocket('ws://yorricks-macbook-pro-4.local:3000')

const attachSocketListeners = props => {
  socket.onerror = event => {
    setError('Couldn\'t connect to server')
    showAlertBar()
  }

  socket.onclose = event => {
    setError('Connection closed by server')
    showAlertBar(5000)
  }

  socket.onmessage = event => {
    const msg = JSON.parse(event.data)

    switch (msg.mType) {
      default:
        console.log('Message with unknown mType received:', msg)
        break
    }
  }
}

/***********************
 ** TeamApp Component **
 ***********************/

function TeamApp(props) {
  const { appState } = props

  // Attach websocket event listeners here
  // so they can read from redux store and dispatch actions
  attachSocketListeners(props)

  /**
   * landingViewComponent returns the component that
   * should render in the landing view based on appState.status
   */
  const landingViewComponent = () => {
    // Form values dependent on current app status
    const formValues = {
      'enteringRoom': {
        fieldType: 'text',
        fieldName: 'room',
        fieldPlaceholder: '123456',
        fieldMaxLength: 6,
        label: 'Enter your room number'
      },
      'enteringPassword': {
        fieldType: 'password',
        fieldName: 'pass',
        fieldPlaceholder: 'hunter2',
        fieldMaxLength: 16,
        label: 'Enter your room\'s password'
      },
      'enteringTeam': {
        fieldType: 'text',
        fieldName: 'teamname',
        fieldPlaceholder: 'Aesop\'s Foibles',
        fieldMaxLength: 16,
        label: 'Enter your team name'
      }
    }

    switch (appState.status) {
      case 'enteringTeam': {
        return <LandingForm
          formData={formValues.enteringTeam}
          handleSubmit={() => {
            props.updateStatus('loading')
            props.updateAfterLoadingStatus('enteringTeam')
            props.updateLoadingMessage('Waiting for quiz master to verify team...')
          }}
        />
      }
      case 'enteringPassword': {
        return <LandingForm
          formData={formValues.enteringPassword}
          handleSubmit={() => {
            props.updateStatus('loading')
            props.updateAfterLoadingStatus('enteringTeam')
            props.updateLoadingMessage('Verifying credentials...')
          }}
        />
      }
      case 'enteringRoom': {
        return <LandingForm
          formData={formValues.enteringRoom}
          handleSubmit={(room) => {
            props.updateStatus('enteringPassword')
            props.updateRoomNumber(room)
          }}
        />
      }
      default:
        return null
    }
  }

  /**
   * TeamApp render
   */

  return <Switch>
    <Route exact path="/authenticate">
      <Landing
        loading={appState.status === 'loading'}
        loadingMessage={appState.loadingMessage !== null ? appState.loadingMessage : 'Loading...'}
      >
        {landingViewComponent()}
      </Landing>
    </Route>

    <Route render={() => {
      // Redirect user to /authenticate

      const { roomid } = props.match.params

      if (roomid !== undefined) {
        props.updateRoomNumber(roomid)
        props.updateStatus('enteringPassword')
      }
      else {
        props.updateRoomNumber(null)
        props.updateStatus('enteringRoom')
      }

      props.history.replace('/') // Remove /:roomid from history so user doesn't get stuck in password screen when going back
      props.history.push('/authenticate')
    }} />
  </Switch>
}

function mapStateToProps(state) {
  return {
    appState: state.appState
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateStatus: status => dispatch(updateStatus(status)),
    updateRoomNumber: room => dispatch(updateRoomNumber(room)),
    updateAfterLoadingStatus: status => dispatch(updateAfterLoadingStatus(status)),
    updateLoadingMessage: message => dispatch(updateLoadingMessage(message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamApp)