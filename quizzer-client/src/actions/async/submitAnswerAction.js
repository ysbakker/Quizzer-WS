import * as quizState from '../quizStateActions'
import * as fetchState from '../fetchStateActions'

import * as GLOBALS from '../../globals'

export default function submitAnswerAction(answer) {
  return (dispatch, getState) => {
    dispatch(fetchState.updateFetchingResultAction(null))
    dispatch(fetchState.updateFetchingAction(true))

    const { currentRoomNumber } = getState().appState

    fetch(`${GLOBALS.API_URL}/rooms/${currentRoomNumber}/round/answers`, {
      method: 'PUT',
      cache: 'no-cache',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        answer: answer
      })
    })
      .then(res => res.json()
        .then(parsed => {
          if (!res.ok) throw parsed
          dispatch(fetchState.updateFetchingAction(false))
          dispatch(fetchState.updateFetchingResultAction('success'))
          dispatch(fetchState.updateFetchingMessageAction(parsed.success))
          dispatch(quizState.setAnswerAction(answer))
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