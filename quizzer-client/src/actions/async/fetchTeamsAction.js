import * as fetchState from '../fetchStateActions'
import * as adminState from '../adminStateActions'

import * as GLOBALS from '../../globals'

export default function fetchTeamsAction() {
  return (dispatch, getState) => {
    dispatch(fetchState.updateFetchingAction(true))

    const { currentRoomNumber } = getState().appState
    const { pendingTeams } = getState().adminState

    fetch(`${GLOBALS.API_URL}/rooms/${currentRoomNumber}/teams/`, {
      method: 'GET',
      cache: 'no-cache',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json()
        // .then(parsed => new Promise(resolve => setTimeout(() => resolve(parsed), 500))) // Simulates loading time
        .then(parsed => {
          if (!res.ok) throw parsed
          dispatch(fetchState.updateFetchingAction(false))

          // Put teams in pendingTeams if they're not in it already
          parsed.teams.forEach(team => {
            if (pendingTeams.every(pt => pt._id !== team._id) && team.name !== undefined) dispatch(adminState.addTeamAction(team))
            if (team.verified) dispatch(adminState.approveTeamAction(team._id))
          })

          // Remove teams from pendingTeams if they no longer exist
          pendingTeams.forEach(team => {
            if (parsed.teams.every(t => t._id !== team._id) || parsed.teams.find(t => t._id === team._id).name === undefined) {
              dispatch(adminState.denyTeamAction(team._id))
            }
          })
        })
        .catch(parsed => {
          const { error } = parsed
          dispatch(fetchState.updateFetchingResultAction(null))
          dispatch(fetchState.updateFetchingAction(false))
          dispatch(fetchState.updateFetchingResultAction('error'))
          dispatch(fetchState.updateFetchingMessageAction(error))
        })
      )
      .catch(err => {
        console.log('fetch error: ', err)
        dispatch(fetchState.updateFetchingResultAction(null))
        dispatch(fetchState.updateFetchingAction(false))
        dispatch(fetchState.updateFetchingResultAction('error'))
        dispatch(fetchState.updateFetchingMessageAction('Couldn\'t fetch from API'))
      })
  }
}