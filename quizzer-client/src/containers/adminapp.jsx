import React from 'react';
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router'

import Landing from '../components/landing'
import LandingForm from '../components/landingform'

import * as appStateActions from '../actions/appStateActions'

/********************
 ** WebSocket conf **
 ********************/

const attachSocketListeners = (props, socket) => {
  socket.onopen = () => {
  }

  socket.onerror = event => {
    props.updateStatus('enteringName')
  }

  socket.onclose = event => {
    props.updateStatus('enteringName')
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

/************************
 ** AdminApp Component **
 ************************/

function AdminApp(props) {
  const { appState } = props

  /**
   * landingViewComponent returns the component that
   * should render in the landing view based on appState.status
   */
  const landingViewComponent = () => {
    // Form values dependent on current app status
    const formValues = {
      'enteringName': {
        fieldType: 'text',
        fieldName: 'name',
        fieldPlaceholder: 'The Liberty Well',
        fieldMaxLength: 16,
        label: 'Enter an interesting room name'
      },
      'enteringPassword': {
        fieldType: 'password',
        fieldName: 'pass',
        fieldPlaceholder: 'welcome123',
        fieldMaxLength: 16,
        label: 'Enter a password for your room'
      }
    }

    switch (appState.status) {
      case 'enteringName': {
        return <LandingForm
          formData={formValues[appState.status]}
          handleSubmit={() => {
            props.updateStatus('enteringPassword')
          }}
        />
      }
      case 'enteringPassword': {
        return <LandingForm
          formData={formValues[appState.status]}
          handleSubmit={() => {
            props.updateStatus('loading')
            props.updateOnSuccessStatus('enteringPassword') // go to app
            props.updateLoadingMessage('Creating room...')
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
    <Route exact path="/create">
      <Landing
        loading={appState.status === 'loading'}
        loadingMessage={appState.loadingMessage !== null ? appState.loadingMessage : 'Loading...'}
      >
        {landingViewComponent()}
      </Landing>
    </Route>

    <Route render={() => {
      props.history.push(`/quizmaster/create`)
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
    updateStatus: status => dispatch(appStateActions.updateStatusAction(status)),
    updateRoomName: name => dispatch(appStateActions.updateRoomNameAction(name)),
    updateOnSuccessStatus: status => dispatch(appStateActions.updateOnSuccessStatusAction(status)),
    updateLoadingMessage: message => dispatch(appStateActions.updateLoadingMessageAction(message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminApp)