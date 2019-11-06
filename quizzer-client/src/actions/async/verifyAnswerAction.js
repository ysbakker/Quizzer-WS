import * as fetchState from '../fetchStateActions'

import fetchSession from './fetchSession'
import defaultFetch from './defaultFetch'

export default function verifyAnswerAction(team, correct) {
  return (dispatch, getState) => {
    dispatch(fetchState.updateFetchAction({ fetching: true, result: null, message: null }))

    defaultFetch(`/rooms/${getState().appState.currentRoomNumber}/round/question`, 'PATCH', JSON.stringify({ team, correct }))
      .then(r => {
        const { APIerr, data } = r
        if (APIerr) {
          const { error } = data
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: error }))
        } else {
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'success', message: data.success }))
          dispatch(fetchSession())
        }
      })
      .catch(err => {
        dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: err }))
      })
  }
}