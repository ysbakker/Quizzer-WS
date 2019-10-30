import * as fetchState from '../fetchStateActions'
import * as adminState from '../adminStateActions'

import * as GLOBALS from '../../globals'

export default function fetchTeamsAction() {
  return (dispatch, getState) => {
    dispatch(fetchState.updateFetchingResultAction(null))
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
        .then(parsed => new Promise(resolve => setTimeout(() => resolve(parsed), 500))) // Simulates loading time
        .then(parsed => {
          if (!res.ok) throw parsed
          dispatch(fetchState.updateFetchingAction(false))

          // Put teams in pendingTeams if they're not in it already
          parsed.teams.forEach(team => {
            if (!pendingTeams.includes(team) && team.name !== undefined) adminState.addTeamAction(team)
          })

          // Remove teams from pendingTeams if they no longer exist
          pendingTeams.forEach(team => {
            if (!parsed.teams.includes(team) || parsed.teams.indexOf(team).name === undefined) adminState.denyTeamAction(team)
          })
        })
        .catch(parsed => {
          const { error } = parsed
          dispatch(fetchState.updateFetchingAction(false))
          dispatch(fetchState.updateFetchingResultAction('error'))
          dispatch(fetchState.updateFetchingMessageAction(error))
        })
      )
      .catch(err => {
        console.log('fetch error: ', err)
        dispatch(fetchState.updateFetchingAction(false))
        dispatch(fetchState.updateFetchingResultAction('error'))
        dispatch(fetchState.updateFetchingMessageAction('Couldn\'t fetch from API'))
      })
  }
}