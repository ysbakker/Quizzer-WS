import * as fetchState from '../fetchStateActions'
import * as quizState from '../quizStateActions'

import { history } from '../../containers/quizzer'
import defaultFetch from './defaultFetch'
import fetchSession from './fetchSession'

export default function setQuestionAction(q) {
  return (dispatch, getState) => {
    dispatch(fetchState.updateFetchAction({ fetching: true, result: null, message: null }))

    defaultFetch(`/rooms/${getState().appState.currentRoomNumber}/round/question`, 'PUT', JSON.stringify({ questionId: q }))
      .then(r => {
        const { APIerr, data } = r
        if (APIerr) {
          const { error } = data
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: error }))
        } else {
          dispatch(fetchState.updateFetchAction({ fetching: false, result: null, message: null }))
          dispatch(quizState.setQuestionAction(data.question))
          dispatch(quizState.setQuestionNrAction(data.question.questionNumber))
          dispatch(fetchSession())
          history.push('/quizmaster/verifyanswers')
        }
      })
      .catch(err => {
        dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: err }))
      })
  }
}