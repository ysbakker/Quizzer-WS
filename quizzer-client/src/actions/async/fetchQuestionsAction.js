import * as fetchState from '../fetchStateActions'
import * as quizState from '../quizStateActions'

import defaultFetch from './defaultFetch'

export default function fetchQuestionsAction(amt = 10) {
  return dispatch => {
    dispatch(fetchState.updateFetchAction({ fetching: true, result: null, message: null }))

    defaultFetch(`/questions/random?amount=${amt}`, 'GET')
      .then(r => {
        const { APIerr, data } = r
        if (APIerr) {
          const { error } = data
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: error }))
        } else {
          dispatch(fetchState.updateFetchAction({ fetching: false, result: null, message: null }))
          dispatch(quizState.setPickableQuestionsAction(data.questions))
        }
      })
      .catch(err => {
        dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: err }))
      })
  }
}