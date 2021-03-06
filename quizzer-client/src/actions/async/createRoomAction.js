import * as appState from '../appStateActions'
import * as fetchState from '../fetchStateActions'

import { createConnectedSocket } from '../../socket'
import { history } from '../../containers/quizzer'

import defaultFetch from './defaultFetch'

export default function createRoomAction() {
  return (dispatch, getState) => {
    dispatch(fetchState.updateFetchAction({ fetching: true, result: null, message: null }))
    dispatch(appState.updateStatusAction('loading'))
    dispatch(appState.updateLoadingMessageAction('Creating room...'))

    defaultFetch(`/rooms`, 'POST', JSON.stringify({ roomname: getState().appState.currentRoomName, password: getState().adminState.password }))
      .then(r => {
        const { APIerr, data } = r
        if (APIerr) {
          const { error } = data
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: error }))
          dispatch(appState.updateStatusAction('enteringName'))
        } else {
          const { success } = data
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'success', message: success }))
          dispatch(appState.updateStatusAction('verifyTeams'))
          dispatch(appState.updateRoomNumberAction(data.number))

          /**
           * Open a socket and store it in 'window'
           * -> To prevent complicated redux middleware
           * -> To prevent storing large socket object in redux store
           */
          window.socket = createConnectedSocket(dispatch)

          history.replace('/quizmaster/verifyteams')
        }
      })
      .catch(err => {
        dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: err }))
        dispatch(appState.updateStatusAction('enteringName'))
      })
  }
}