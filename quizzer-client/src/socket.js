import * as GLOBALS from './globals'

import * as fetchState from './actions/fetchStateActions'
import * as appState from './actions/appStateActions'
import * as quizState from './actions/quizStateActions'

import fetchTeams from './actions/async/fetchTeamsAction'
import fetchAnswers from './actions/async/fetchAnswersAction'

import { history } from './containers/quizzer'
import recoverStateAction from './actions/async/recoverStateAction'

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
  socket.onopen = () => {
    // Do nothing for now
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
      case 'start_round':
        dispatch(appState.updateStatusAction('loading'))
        dispatch(appState.updateLoadingMessageAction('Quizmaster is picking categories...'))
        break;
      case 'set_categories':
        dispatch(appState.updateStatusAction('loading'))
        dispatch(appState.updateLoadingMessageAction('Waiting for the first question to start...'))
        break;
      case 'name_approved':
        dispatch(fetchState.updateFetchingAction(false))
        dispatch(fetchState.updateFetchingResultAction(null))
        dispatch(fetchState.updateFetchingResultAction('success'))
        dispatch(fetchState.updateFetchingMessageAction('Your team name was approved'))
        dispatch(appState.updateStatusAction('loading'))
        dispatch(appState.updateLoadingMessageAction('Waiting for the round to start...'))
        history.push('/quiz')
        break;
      case 'name_denied':
        dispatch(fetchState.updateFetchingAction(false))
        dispatch(fetchState.updateFetchingResultAction(null))
        dispatch(fetchState.updateFetchingResultAction('error'))
        dispatch(fetchState.updateFetchingMessageAction('Your team name was denied'))
        dispatch(appState.updateStatusAction('enteringTeam'))
        break;
      case 'answer_approved':
        dispatch(appState.updateStatusAction('answerCorrect'))
        break;
      case 'answer_denied':
        dispatch(appState.updateStatusAction('answerIncorrect'))
        dispatch(quizState.setAnswerAction(msg.answer))
        break;
      case 'question_closed':
        dispatch(appState.updateLoadingMessageAction('Waiting for quizmaster to verify answer...'))
        dispatch(appState.updateStatusAction('loading'))
        break;
      case 'next_question':
        dispatch(appState.updateStatusAction('quizz'))
        dispatch(quizState.setAnswerAction(null))
        dispatch(recoverStateAction())
        break;
      case 'new_team':
        dispatch(fetchTeams())
        break;
      case 'new_answer':
        dispatch(fetchAnswers())
        break;
      default:
        console.log('Message with unknown mType received:', msg)
        break
    }
  }
}