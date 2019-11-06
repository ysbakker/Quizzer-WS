import * as appState from '../appStateActions'
import * as fetchState from '../fetchStateActions'

import defaultFetch from './defaultFetch'

export default function renameTeamAction(teamname) {
  return (dispatch, getState) => {
    dispatch(fetchState.updateFetchAction({ fetching: true, result: null, message: null }))
    dispatch(appState.updateStatusAction('loading'))
    dispatch(appState.updateLoadingMessageAction('Submitting team name...'))
    const { currentRoomNumber, teamId } = getState().appState
    defaultFetch(`/rooms/${currentRoomNumber}/teams/${teamId}`, 'PATCH', JSON.stringify({ name: teamname }))
      .then(r => {
        const { APIerr, data } = r
        if (APIerr) {
          const { error } = data
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: error }))
          if (APIerr === 401) dispatch(appState.updateStatusAction('enteringTeam'))
          else dispatch(appState.updateStatusAction('enteringRoom'))
        } else {
          const { success } = data
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'success', message: success }))
          dispatch(appState.updateLoadingMessageAction('Waiting for quizmaster to verify team...'))
          dispatch(appState.updateTeamNameAction(teamname))
        }
      })
      .catch(err => {
        dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: err }))
        dispatch(appState.updateStatusAction('enteringRoom'))
      })
  }
}