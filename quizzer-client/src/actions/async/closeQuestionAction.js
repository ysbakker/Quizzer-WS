import * as fetchState from '../fetchStateActions'
import * as quizState from '../quizStateActions'

import * as GLOBALS from '../../globals'

export default function closeQuestionAction() {
  return (dispatch, getState) => {
    dispatch(fetchState.updateFetchingResultAction(null))
    dispatch(fetchState.updateFetchingAction(true))

    const { currentRoomNumber } = getState().appState

    fetch(`${GLOBALS.API_URL}/rooms/${currentRoomNumber}/round`, {
      ...GLOBALS.FETCH_OPTIONS,
      method: 'PATCH',
      body: JSON.stringify({
        open: false
      })
    })
      .then(res => res.json()
        .then(parsed => {
          if (!res.ok) throw parsed
          dispatch(fetchState.updateFetchingAction(false))
          dispatch(fetchState.updateFetchingResultAction('success'))
          dispatch(fetchState.updateFetchingMessageAction(parsed.success))
          dispatch(quizState.setQuestionAction({ ...getState().quizState.question, open: false }))
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