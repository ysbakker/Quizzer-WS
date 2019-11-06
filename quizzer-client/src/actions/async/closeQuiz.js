import * as appState from '../appStateActions'
import * as fetchState from '../fetchStateActions'

import defaultFetch from './defaultFetch'

export default function closeQuiz() {
  return (dispatch, getState) => {
    dispatch(fetchState.updateFetchAction({ fetching: true, result: null, message: null }))

    defaultFetch(`/rooms/${getState().appState.currentRoomNumber}`, 'PATCH', JSON.stringify({ open: false }))
      .then(r => {
        const { APIerr, data } = r
        if (APIerr) {
          const { error } = data
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: error }))
        } else {
          const { success } = data
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'success', message: success }))
          dispatch(appState.updateStatusAction('closed'))
        }
      })
      .catch(err => {
        dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: err }))
        dispatch(appState.updateStatusAction('enteringRoom'))
      })
  }
}