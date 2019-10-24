import updateOnSuccessStatus from './appState/updateOnSuccessStatus'
import updateLoadingMessageAction from './appState/updateLoadingMessage'
import updateStatusAction from './appState/updateStatus'
import updateFetchingAction from './fetchState/updateFetching'

import * as GLOBALS from '../globals'

export default function authenticateAction(roomid, password) {
  return dispatch => {
    dispatch(updateFetchingAction(true))
    dispatch(updateStatusAction('loading'))
    dispatch(updateOnSuccessStatus('enteringTeam'))
    dispatch(updateLoadingMessageAction('Connecting to WebSocket...'))

    fetch(`${GLOBALS.API_URL}/rooms/${roomid}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: password
      })
    })
      .then(res => {
        res.json()
          .then(parsed => {
            if (!res.ok) throw parsed

          })
          .catch(parsed => {
            const { error } = parsed
          })
      })
  }
}