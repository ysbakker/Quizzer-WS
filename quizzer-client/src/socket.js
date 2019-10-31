import * as GLOBALS from './globals'

import * as fetchState from './actions/fetchStateActions'
import * as appState from './actions/appStateActions'

import fetchTeams from './actions/async/fetchTeamsAction'

/********************
 ** WebSocket conf **
 ********************/

/**
 * @param {*} dispatch Redux's store.dispatch() gets passed so actions can be dispatched in the websocket event listeners
 */
export const createConnectedSocket = dispatch => {
  const s = new WebSocket(GLOBALS.SOCKET_URL)

  attachSocketListeners(s, dispatch)

  return s
}

/**
 * attachSocketListeners gets the 'dispatch' param so it can dispatch
 * actions to the redux store.
 */
const attachSocketListeners = (socket, dispatch) => {
  // const { dispatch } = store

  socket.onopen = () => {
    dispatch(fetchState.updateFetchingResultAction(null))
    dispatch(fetchState.updateFetchingMessageAction('Socket opened!'))
    dispatch(fetchState.updateFetchingResultAction('success'))
  }

  socket.onerror = event => {
    dispatch(fetchState.updateFetchingResultAction(null))
    dispatch(fetchState.updateFetchingMessageAction('Socket error occured.'))
    dispatch(fetchState.updateFetchingResultAction('error'))
  }

  socket.onclose = event => {
    dispatch(fetchState.updateFetchingResultAction(null))
    dispatch(fetchState.updateFetchingMessageAction('Unexpectedly lost WebSocket connection: please refresh the page.'))
    dispatch(fetchState.updateFetchingResultAction('error'))
  }

  socket.onmessage = event => {
    const msg = JSON.parse(event.data)

    switch (msg.mType) {
      case 'name_approved':
        break;
      case 'name_denied':
        dispatch(fetchState.updateFetchingResultAction(null))
        dispatch(fetchState.updateFetchingResultAction('error'))
        dispatch(fetchState.updateFetchingMessageAction('Your team name was denied'))
        dispatch(appState.updateStatusAction('enteringTeam'))
        break;
      case 'new_team':
        dispatch(fetchTeams())
        break;
      default:
        console.log('Message with unknown mType received:', msg)
        break
    }
  }
}