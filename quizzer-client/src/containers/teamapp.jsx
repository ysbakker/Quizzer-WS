import React from 'react';
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router'

import Landing from '../components/landing'
import LandingForm from '../components/landingform'

import * as appStateActions from '../actions/appStateActions'
import authenticateAction from '../actions/async/authenticateAction'
import renameTeamAction from '../actions/async/renameTeamAction'

import * as GLOBALS from '../globals'

/********************
 ** WebSocket conf **
 ********************/

const attachSocketListeners = (props, socket) => {
  socket.onerror = event => {
  }

  socket.onclose = event => {

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

class TeamApp extends React.Component {
  /**
   * landingViewComponent returns the component that
   * should render in the landing view based on appState.status
   */
  landingViewComponent = () => {
    const { props } = this
    const { appState } = props
    // Form values dependent on current app status
    const formValues = {
      'enteringRoom': {
        fieldType: 'text',
        fieldName: 'room',
        fieldPlaceholder: '123456',
        fieldMaxLength: 6,
        label: 'Enter your room number',
        validation: {
          len: 6
        }
      },
      'enteringPassword': {
        fieldType: 'password',
        fieldName: 'pass',
        fieldPlaceholder: 'hunter2',
        fieldMaxLength: 16,
        label: 'Enter your room\'s password',
        validation: {
          min: 2,
          max: 16
        }
      },
      'enteringTeam': {
        fieldType: 'text',
        fieldName: 'teamname',
        fieldPlaceholder: 'Aesop\'s Foibles',
        fieldMaxLength: 16,
        label: 'Enter your team name',
        validation: {
          min: 2,
          max: 16
        }
      }
    }

    switch (appState.status) {
      case 'enteringRoom': {
        return <LandingForm
          formData={formValues[appState.status]}
          handleSubmit={room => {
            props.updateStatus('enteringPassword')
            props.updateRoomNumber(room)
          }}
        />
      }
      case 'enteringPassword': {
        return <LandingForm
          formData={formValues[appState.status]}
          handleSubmit={password => {
            props.authenticate(appState.currentRoomNumber, password)
          }}
        />
      }
      case 'enteringTeam': {
        return <LandingForm
          formData={formValues[appState.status]}
          handleSubmit={name => {
            props.renameTeam(name, appState.currentRoomNumber, appState.teamId)
          }}
        />
      }
      default:
        return null
    }
  }

  componentDidMount() {
    const { props } = this
    props.updateStatus('enteringRoom')
  }

  /**
   * TeamApp render
   */

  render() {
    const { props } = this
    const { appState } = props
    return <Switch>
      <Route exact path="/authenticate">
        <Landing
          loading={appState.status === 'loading'}
          loadingMessage={appState.loadingMessage !== null ? appState.loadingMessage : 'Loading...'}
        >
          {this.landingViewComponent()}
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
    </Switch >
  }
}

function mapStateToProps(state) {
  return {
    appState: state.appState
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateRoomNumber: number => dispatch(appStateActions.updateRoomNumberAction(number)),
    updateStatus: status => dispatch(appStateActions.updateStatusAction(status)),
    authenticate: (roomid, password) => dispatch(authenticateAction(roomid, password)),
    renameTeam: (teamname) => dispatch(renameTeamAction(teamname))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamApp)