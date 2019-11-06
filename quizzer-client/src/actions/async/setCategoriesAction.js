import * as fetchState from '../fetchStateActions'

import { history } from '../../containers/quizzer'

import fetchQuestionsAction from './fetchQuestionsAction'
import defaultFetch from './defaultFetch'

export default function setCategoriesAction(cats) {
  return (dispatch, getState) => {
    dispatch(fetchState.updateFetchAction({ fetching: true, result: null, message: null }))

    defaultFetch(`/rooms/${getState().appState.currentRoomNumber}/round/categories`, 'PUT', JSON.stringify({ categories: cats }))
      .then(r => {
        const { APIerr, data } = r
        if (APIerr) {
          const { error } = data
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: error }))
        } else {
          dispatch(fetchState.updateFetchAction({ fetching: false, result: null, message: null }))
          dispatch(fetchQuestionsAction())
          history.push('/quizmaster/pickquestion')
        }
      })
      .catch(err => {
        dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: err }))
      })
  }
}