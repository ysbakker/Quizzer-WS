import * as fetchState from '../fetchStateActions'
import * as quizState from '../quizStateActions'

import fetchCategories from './fetchCategoriesAction'
import defaultFetch from './defaultFetch'

import { history } from '../../containers/quizzer'

export default function startRoundAction() {
  return (dispatch, getState) => {
    dispatch(fetchState.updateFetchAction({ fetching: true, result: null, message: null }))

    defaultFetch(`/rooms/${getState().appState.currentRoomNumber}/round`, 'PUT')
      .then(r => {
        const { APIerr, data } = r
        if (APIerr) {
          const { error } = data
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: error }))
        } else {
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'success', message: data.success }))
          dispatch(quizState.setRoundAction(getState().quizState.round + 1))
          dispatch(quizState.setQuestionNrAction(0))
          dispatch(fetchCategories())
          history.push('/quizmaster/pickcategories')
        }
      })
      .catch(err => {
        dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: err }))
      })
  }
}