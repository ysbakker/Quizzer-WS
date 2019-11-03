import * as fetchState from '../fetchStateActions'
import * as quizState from '../quizStateActions'

import { history } from '../../containers/quizzer'

import * as GLOBALS from '../../globals'

export default function setQuestionAction(q) {
  return (dispatch, getState) => {
    dispatch(fetchState.updateFetchingAction(true))

    const { currentRoomNumber } = getState().appState

    fetch(`${GLOBALS.API_URL}/rooms/${currentRoomNumber}/round`, {
      method: 'PATCH',
      cache: 'no-cache',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        questionId: q
      })
    })
      .then(res => res.json()
        .then(parsed => {
          if (!res.ok) throw parsed
          dispatch(fetchState.updateFetchingAction(false))
          dispatch(quizState.setQuestionAction(parsed.question))
          dispatch(quizState.setQuestionNrAction(parsed.questionNr))
          dispatch(quizState.setAnswerAction(parsed.action))
          // history.push('/quizmaster/verifyquestions')
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