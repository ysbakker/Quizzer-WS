import * as quizState from '../quizStateActions'
import * as fetchState from '../fetchStateActions'

import defaultFetch from './defaultFetch'

export default function submitAnswerAction(answer) {
  return (dispatch, getState) => {
    dispatch(fetchState.updateFetchAction({ fetching: true, result: null, message: null }))

    defaultFetch(`/rooms/${getState().appState.currentRoomNumber}/round/answers`, 'PATCH', JSON.stringify({ answer: answer }))
      .then(r => {
        const { APIerr, data } = r
        if (APIerr) {
          const { error } = data
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: error }))
        } else {
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'success', message: data.success }))
          dispatch(quizState.setAnswerAction(answer))
        }
      })
      .catch(err => {
        dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: err }))
      })
  }
}