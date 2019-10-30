import * as appState from '../appStateActions'
import * as fetchState from '../fetchStateActions'
import fetchTeams from './fetchTeamsAction'

import * as GLOBALS from '../../globals'

import { history } from '../../containers/quizzer'

export default function createRoomAction() {
  return (dispatch, getState) => {
    dispatch(fetchState.updateFetchingResultAction(null))
    dispatch(fetchState.updateFetchingAction(true))
    dispatch(appState.updateStatusAction('loading'))
    dispatch(appState.updateLoadingMessageAction('Creating room...'))

    fetch(`${GLOBALS.API_URL}/rooms`, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomname: getState().appState.currentRoomName,
        password: getState().adminState.password
      })
    })
      .then(res => res.json()
        .then(parsed => new Promise(resolve => setTimeout(() => resolve(parsed), 500))) // Simulates loading time
        .then(parsed => {
          if (!res.ok) throw parsed
          dispatch(fetchState.updateFetchingAction(false))
          dispatch(fetchState.updateFetchingResultAction('success'))
          dispatch(fetchState.updateFetchingMessageAction(parsed.success))
          dispatch(appState.updateRoomNumberAction(parsed.number))
          dispatch(fetchTeams())
          history.push('/quizmaster/verifyteams')
        })
        .catch(parsed => {
          const { error } = parsed
          dispatch(fetchState.updateFetchingAction(false))
          dispatch(fetchState.updateFetchingResultAction('error'))
          dispatch(fetchState.updateFetchingMessageAction(error))
          dispatch(appState.updateStatusAction('enteringName'))
        })
      )
      .catch(err => {
        console.log('fetch error: ', err)
        dispatch(fetchState.updateFetchingAction(false))
        dispatch(fetchState.updateFetchingResultAction('error'))
        dispatch(fetchState.updateFetchingMessageAction('Couldn\'t fetch from API'))
        dispatch(appState.updateStatusAction('enteringName'))
      })
  }
}