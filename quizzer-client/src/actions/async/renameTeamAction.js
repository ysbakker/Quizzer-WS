import * as appState from '../appStateActions'
import * as fetchState from '../fetchStateActions'

import * as GLOBALS from '../../globals'
import { store } from '../../index'

export default function renameTeamAction(teamname) {
  return (dispatch, getState) => {
    dispatch(fetchState.updateFetchingResultAction(null))
    dispatch(fetchState.updateFetchingAction(true))
    dispatch(appState.updateStatusAction('loading'))
    dispatch(appState.updateLoadingMessageAction('Submitting team name...'))

    const { currentRoomNumber, teamId } = getState().appState

    fetch(`${GLOBALS.API_URL}/rooms/${currentRoomNumber}/teams/${teamId}`, {
      method: 'PATCH',
      cache: 'no-cache',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: teamname
      })
    })

      .then(res => res.json()
        .then(parsed => new Promise(resolve => setTimeout(() => resolve(parsed), 500))) // Simulates loading time
        .then(parsed => {
          console.log('parsed: ', parsed)
          if (!res.ok) throw parsed
          dispatch(fetchState.updateFetchingAction(false))
          dispatch(fetchState.updateFetchingResultAction('success'))
          dispatch(fetchState.updateFetchingMessageAction(parsed.success))
          dispatch(appState.updateLoadingMessageAction('Waiting for quizmaster to verify team...'))
          dispatch(appState.updateTeamNameAction(teamname))
        })
        .catch(parsed => {
          console.log(parsed)
          const { error } = parsed
          dispatch(fetchState.updateFetchingAction(false))
          dispatch(fetchState.updateFetchingResultAction('error'))
          dispatch(fetchState.updateFetchingMessageAction(error))
          if (res.status === 401) dispatch(appState.updateStatusAction('enteringTeam'))
          else dispatch(appState.updateStatusAction('enteringRoom'))
        })
      )
      .catch(err => {
        console.log('fetch error: ', err)
        dispatch(fetchState.updateFetchingAction(false))
        dispatch(fetchState.updateFetchingResultAction('error'))
        dispatch(fetchState.updateFetchingMessageAction('Couldn\'t fetch from API'))
        dispatch(appState.updateStatusAction('enteringRoom'))
      })
  }
}