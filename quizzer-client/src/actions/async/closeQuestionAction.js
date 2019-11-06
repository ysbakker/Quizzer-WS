import * as fetchState from '../fetchStateActions'
import * as quizState from '../quizStateActions'
import defaultFetch from './defaultFetch'

export default function closeQuestionAction() {
  return (dispatch, getState) => {
    dispatch(fetchState.updateFetchAction({ fetching: true, result: null, message: null }))

    defaultFetch(`/rooms/${getState().appState.currentRoomNumber}/round/question`, 'PATCH', JSON.stringify({ open: false }))
      .then(r => {
        const { APIerr, data } = r
        if (APIerr) {
          const { error } = data
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: error }))
        } else {
          const { success } = data
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'success', message: success }))
          dispatch(quizState.setQuestionAction({ ...getState().quizState.question, open: false }))
        }
      })
      .catch(err => {
        dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: err }))
      })
  }
}