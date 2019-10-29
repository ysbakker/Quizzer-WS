import React from 'react';
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router'

import Landing from '../components/landing'
import LandingForm from '../components/landingform'

import * as appStateActions from '../actions/appStateActions'
import createRoomAction from '../actions/async/createRoomAction'

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

class AdminApp extends React.Component {
  /**
   * landingViewComponent returns the component that
   * should render in the landing view based on appState.status
   */
  landingViewComponent = () => {
    const { props } = this
    const { appState } = props
    // Form values dependent on current app status
    const formValues = {
      'enteringName': {
        fieldType: 'text',
        fieldName: 'name',
        fieldPlaceholder: 'The Liberty Well',
        fieldMaxLength: 16,
        label: 'Enter an interesting room name',
        validation: {
          min: 2,
          max: 16
        }
      },
      'enteringPassword': {
        fieldType: 'password',
        fieldName: 'pass',
        fieldPlaceholder: 'welcome123',
        fieldMaxLength: 16,
        label: 'Enter a password for your room',
        validation: {
          min: 2,
          max: 16
        }
      }
    }

    switch (appState.status) {
      case 'enteringName': {
        return <LandingForm
          formData={formValues[appState.status]}
          handleSubmit={name => {
            props.updateStatus('enteringPassword')
            props.updateRoomName(name)
          }}
        />
      }
      case 'enteringPassword': {
        return <LandingForm
          formData={formValues[appState.status]}
          handleSubmit={password => {
            props.createRoom(password)
          }}
        />
      }
      default:
        return null
    }
  }

  componentDidMount() {
    const { props } = this

    props.updateStatus('enteringName')
  }

  /**
   * TeamApp render
   */

  render() {
    const { props } = this
    const { appState } = props
    return <Switch>
      <Route exact path="/quizmaster/create">
        <Landing
          loading={appState.status === 'loading'}
          loadingMessage={appState.loadingMessage !== null ? appState.loadingMessage : 'Loading...'}
        >
          {this.landingViewComponent()}
        </Landing>
      </Route>

      <Route exact path="/quizmaster" render={() => {
        props.history.push(`/quizmaster/create`)
      }} />
    </Switch>
  }
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
    createRoom: password => dispatch(createRoomAction(password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminApp)