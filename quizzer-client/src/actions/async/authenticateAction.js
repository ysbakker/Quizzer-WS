import * as appState from '../appStateActions'
import * as fetchState from '../fetchStateActions'

import * as GLOBALS from '../../globals'
import { createConnectedSocket } from '../../socket'

export default function authenticateAction(roomid, password) {
  return dispatch => {
    dispatch(fetchState.updateFetchingResultAction(null))
    dispatch(fetchState.updateFetchingAction(true))
    dispatch(appState.updateStatusAction('loading'))
    dispatch(appState.updateLoadingMessageAction('Connecting to WebSocket...'))

    fetch(`${GLOBALS.API_URL}/rooms/${roomid}/teams`, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: password
      })
    })
      .then(res => res.json()
        .then(parsed => new Promise(resolve => setTimeout(() => resolve(parsed), 500))) // Simulates loading time
        .then(parsed => {
          if (!res.ok) throw parsed
          dispatch(fetchState.updateFetchingAction(false))
          dispatch(fetchState.updateFetchingResultAction('success'))
          dispatch(fetchState.updateFetchingMessageAction(parsed.success))
          dispatch(appState.updateRoomNameAction(parsed.roomname))
          dispatch(appState.updateTeamIdAction(parsed.teamid))
          dispatch(appState.updateStatusAction('enteringTeam'))

          /**
           * Open a socket and store it in 'window'
           * -> To prevent complicated redux middleware
           * -> To prevent storing large socket object in redux store
           */
          window.socket = createConnectedSocket(dispatch)
        })
        .catch(parsed => {
          const { error } = parsed
          dispatch(fetchState.updateFetchingAction(false))
          dispatch(fetchState.updateFetchingResultAction('error'))
          dispatch(fetchState.updateFetchingMessageAction(error))
          if (res.status === 401) dispatch(appState.updateStatusAction('enteringPassword'))
          else dispatch(appState.updateStatusAction('enteringRoom'))
        })
      )
      .catch(err => {
        console.log('fetch error: ', err)
        dispatch(fetchState.updateFetchingAction(false))
        dispatch(fetchState.updateFetchingResultAction('error'))
        dispatch(fetchState.updateFetchingMessageAction('Couldn\'t fetch from API'))
        dispatch(appState.updateStatusAction('enteringRoom'))
      })
  }
}