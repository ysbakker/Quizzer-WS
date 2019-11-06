import * as appState from '../appStateActions'
import * as fetchState from '../fetchStateActions'

import { createConnectedSocket } from '../../socket'

import defaultFetch from './defaultFetch'

export default function authenticate(roomid, password) {
  return dispatch => {
    dispatch(fetchState.updateFetchAction({ fetching: true, result: null, message: null }))
    dispatch(appState.updateStatusAction('loading'))
    dispatch(appState.updateLoadingMessageAction('Connecting to WebSocket...'))

    defaultFetch(`/rooms/${roomid}/teams`, 'POST', JSON.stringify({ password: password }))
      .then(r => {
        const { APIerr, data } = r
        if (APIerr) {
          const { error } = data
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: error }))
          if (APIerr === 401) dispatch(appState.updateStatusAction('enteringPassword'))
          else dispatch(appState.updateStatusAction('enteringRoom'))
        } else {
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'success', message: data.success }))
          dispatch(appState.updateRoomNameAction(data.roomname))
          dispatch(appState.updateTeamIdAction(data.teamid))
          dispatch(appState.updateStatusAction('enteringTeam'))

          /**
           * Open a socket and store it in 'window'
           * -> To prevent complicated redux middleware
           * -> To prevent storing large socket object in redux store
           */
          window.socket = createConnectedSocket(dispatch)
        }
      })
      .catch(err => {
        dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: err }))
        dispatch(appState.updateStatusAction('enteringRoom'))
      })
  }
}