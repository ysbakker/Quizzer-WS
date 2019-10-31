import React from 'react';
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router'

import Landing from '../components/landing'
import LandingForm from '../components/landingform'

import ListView from '../components/listview'
import ApproveItem from '../components/approveitem'

import * as appStateActions from '../actions/appStateActions'
import * as adminStateActions from '../actions/adminStateActions'
import * as fetchStateActions from '../actions/fetchStateActions'

import createRoomAction from '../actions/async/createRoomAction'
import verifyTeamAction from '../actions/async/verifyTeamAction'
import fetchTeamsAction from '../actions/async/fetchTeamsAction'

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
            props.updateRoomPassword(password)
            props.createRoom()
          }}
        />
      }
      default:
        return null
    }
  }

  componentDidMount() {
    const { props } = this

    if (props.appState.status === 'enteringRoom') props.updateStatus('enteringName')
    // this.socket = new WebSocket(GLOBALS.SOCKET_URL)
    // attachSocketListeners(this.socket, props)
  }

  /**
   * TeamApp render
   */

  render() {
    const { props } = this
    const { appState, adminState } = props
    return <Switch>
      <Route exact path="/quizmaster/create">
        <Landing
          loading={appState.status === 'loading'}
          loadingMessage={appState.loadingMessage !== null ? appState.loadingMessage : 'Loading...'}
        >
          {this.landingViewComponent()}
        </Landing>
      </Route>
      <Route exact path="/quizmaster/verifyteams">
        <ListView
          title='Approve teams'
          items={adminState.pendingTeams.map(team => { return { id: team._id, text: team.name } })}
          ListItemComponent={attributes => <ApproveItem
            {...attributes}
            acceptTeamHandler={(id) => props.verifyTeam(id, true)}
            denyTeamHandler={(id) => props.verifyTeam(id, false)}
          />}
        />
      </Route>

      <Route exact path="/quizmaster" render={() => {
        props.history.push(`/quizmaster/create`)
      }} />
    </Switch>
  }
}

function mapStateToProps(state) {
  return {
    appState: state.appState,
    adminState: state.adminState
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateStatus: status => dispatch(appStateActions.updateStatusAction(status)),
    updateRoomName: name => dispatch(appStateActions.updateRoomNameAction(name)),
    updateRoomPassword: password => dispatch(adminStateActions.updateRoomPasswordAction(password)),
    createRoom: password => dispatch(createRoomAction(password)),
    verifyTeam: (teamid, accepted) => dispatch(verifyTeamAction(teamid, accepted)),
    fetchTeams: () => dispatch(fetchTeamsAction()),
    updateFetchingMessage: message => dispatch(fetchStateActions.updateFetchingMessageAction(message)),
    updateFetchingResult: result => dispatch(fetchStateActions.updateFetchingResultAction(result))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminApp)