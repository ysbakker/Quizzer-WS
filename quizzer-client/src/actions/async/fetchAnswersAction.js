import * as fetchState from '../fetchStateActions'
import * as adminState from '../adminStateActions'

import * as GLOBALS from '../../globals'

export default function fetchCategoriesAction() {
  return (dispatch, getState) => {
    dispatch(fetchState.updateFetchingAction(true))

    const { currentRoomNumber } = getState().appState

    fetch(`${GLOBALS.API_URL}/rooms/${currentRoomNumber}/round/answers`, {
      ...GLOBALS.FETCH_OPTIONS,
      method: 'GET'
    })
      .then(res => res.json()
        .then(parsed => {
          if (!res.ok) throw parsed
          dispatch(fetchState.updateFetchingAction(false))

          dispatch(adminState.setAnswersAction(parsed.answers))
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