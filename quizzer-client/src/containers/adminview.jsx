import React from 'react'
import { connect } from 'react-redux'

import TopPanel from '../components/toppanel'
import InfoPanel from '../components/infopanel'
import TeamsPanel from '../components/teamspanel'
import ActionButton from '../components/actionbutton'

/**
 * AdminView always renders a few info panels to show the current
 * game state.
 * It receives the currently rendered list view and active buttons.
 */
function AdminView(props) {
  const { adminState, appState, buttons, children } = props
  return <div className="admin-container">
    <div className="admin-left">
      <TopPanel
        roomid={appState.currentRoomNumber}
        roomname={appState.currentRoomName}
      />
      {children}
    </div>
    <div className="admin-right">
      <InfoPanel
        roomname={appState.currentRoomName}
      />
      <TeamsPanel
        teams={adminState.approvedTeams}
      />
      <ActionButton
        buttons={buttons}
      />
    </div>
  </div>
}

function mapStateToProps(state) {
  return {
    appState: state.appState,
    adminState: state.adminState,
    quizState: state.quizState
  }
}

export default connect(mapStateToProps)(AdminView)