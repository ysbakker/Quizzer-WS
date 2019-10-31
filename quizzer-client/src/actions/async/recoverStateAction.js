import * as fetchState from '../fetchStateActions'
import * as adminState from '../adminStateActions'
import * as appState from '../appStateActions'

import fetchTeams from './fetchTeamsAction'

import * as GLOBALS from '../../globals'
import { createConnectedSocket } from '../../socket'

import { history } from '../../containers/quizzer'

export default function recoverStateAction() {
  return dispatch => {
    dispatch(fetchState.updateFetchingResultAction(null))
    dispatch(fetchState.updateFetchingAction(true))

    // Fetch game state from server
    fetch(`${GLOBALS.API_URL}`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-cache',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json()
        .then(parsed => {
          if (!res.ok) throw parsed
          // We have an active session and received some game state from the server!
          dispatch(fetchState.updateFetchingAction(false))
          dispatch(fetchState.updateFetchingResultAction('success'))
          dispatch(fetchState.updateFetchingMessageAction('Welcome back!'))
          dispatch(appState.updateRoomNameAction(parsed.name))
          dispatch(appState.updateRoomNumberAction(parsed.number))

          // open socket
          dispatch(appState.setSocketAction(createConnectedSocket(dispatch)))

          if (parsed.role === 'quizmaster') {
            history.replace('/quizmaster/verifyteams')
            dispatch(adminState.updateRoomPasswordAction(parsed.password))
            dispatch(fetchTeams())
          } else {
            dispatch(appState.updateTeamIdAction(parsed.team._id))
            if (parsed.team.name === undefined) {
              history.replace('/authenticate')
              dispatch(appState.updateStatusAction('enteringTeam'))
            } else if (parsed.team.name !== undefined && !parsed.team.verified) {
              history.replace('/authenticate')
              dispatch(appState.updateStatusAction('loading'))
              dispatch(appState.updateLoadingMessageAction('Waiting for quizmaster to verify team...'))
            } else if (parsed.team.verified) {
              history.replace('/game')
              // Team name is verified, team is in the game
            }
          }
        })
        .catch(() => {
          // when an error respone happens, it means the client doesn't have
          // a session stored on the server.
          // In this case, the fetch request just gets ignored and the client gets sent to the landing route
          history.location.pathname.includes('quizmaster') ? history.replace('/quizmaster/create') : history.replace('/authenticate')
          dispatch(fetchState.updateFetchingAction(false))
        })
      )
      .catch(err => {
        console.log('fetch error: ', err)
        dispatch(fetchState.updateFetchingAction(false))
      })
  }
}