import * as fetchState from '../fetchStateActions'
import * as quizState from '../quizStateActions'

import * as GLOBALS from '../../globals'

export default function fetchCategoriesAction() {
  return dispatch => {
    dispatch(fetchState.updateFetchingAction(true))

    fetch(`${GLOBALS.API_URL}/categories`, {
      ...GLOBALS.FETCH_OPTIONS,
      method: 'GET'
    })
      .then(res => res.json()
        .then(parsed => {
          if (!res.ok) throw parsed
          dispatch(fetchState.updateFetchingAction(false))

          dispatch(quizState.setPickableCategoriesAction(parsed.categories))
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