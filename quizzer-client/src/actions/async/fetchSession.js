import * as fetchState from '../fetchStateActions'
import * as adminState from '../adminStateActions'
import * as appState from '../appStateActions'
import * as quizState from '../quizStateActions'

import fetchCategories from './fetchCategoriesAction'
import fetchQuestionsAction from './fetchQuestionsAction'

import defaultFetch from './defaultFetch'

import { createConnectedSocket } from '../../socket'
import { history } from '../../containers/quizzer'

export default function fetchSession(recover = false) {
  return dispatch => {
    dispatch(fetchState.updateFetchAction({ fetching: true, result: null, message: null }))

    defaultFetch(`/session`, 'GET')
      .then(r => {
        const { APIerr, data } = r
        if (APIerr) {
          // when an error respone happens, it means the client doesn't have
          // a session stored on the server.
          // In this case, the fetch request just gets ignored and the client gets sent to the landing route
          dispatch(fetchState.updateFetchAction({ fetching: false, result: null, message: null }))
          history.location.pathname.includes('quizmaster') ? history.replace('/quizmaster/create') : history.replace('/authenticate')
        } else {
          // Get the teams
          if (data.teams.length > 0) {
            dispatch(adminState.clearTeamsAction())
            data.teams.forEach(t => {
              if (t.name) dispatch(adminState.addTeamAction(t))
              if (t.name && t.verified) dispatch(adminState.approveTeamAction(t._id))
            })
          }

          dispatch(fetchState.updateFetchAction({ fetching: false, result: null, message: null }))
          if (recover) {
            dispatch(fetchState.updateFetchAction({ fetching: false, result: 'success', message: 'Welcome back!' }))
          }

          // We have an active session and received some game state from the server!
          dispatch(quizState.setRoundAction(data.currentRound))
          dispatch(appState.updateRoomNameAction(data.name))
          dispatch(appState.updateRoomNumberAction(data.number))
          dispatch(quizState.setQuestionNrAction(data.currentQuestion))
          if (data.round && data.round.question.questiondata) dispatch(quizState.setQuestionAction({ ...data.round.question.questiondata, open: data.round.question.open }))
          else dispatch(quizState.setQuestionAction(null))

          /**
           * Open a socket and store it in 'window' if it's a state recovery
           * -> To prevent complicated redux middleware
           * -> To prevent storing large socket object in redux store
           */
          if (recover) window.socket = createConnectedSocket(dispatch)

          if (data.role === 'quizmaster') {
            dispatch(adminState.updateRoomPasswordAction(data.password))

            // Determine where to send the user
            if (data.currentRound === 0) {
              history.replace('/quizmaster/verifyteams')
            } else if (data.round.categories.length === 0) {
              dispatch(fetchCategories())
              history.replace('/quizmaster/pickcategories')
            } else if (data.round.question.open === true || (data.round.question.open === false && data.round.question.answers.length !== 0)) {
              dispatch(adminState.setAnswersAction(data.round.question.answers))
              history.replace('/quizmaster/verifyanswers')
            } else {
              data.round.categories.forEach(cat => {
                dispatch(quizState.addCategoryAction(cat))
              })
              dispatch(fetchQuestionsAction())
              history.replace('/quizmaster/pickquestion')
            }
          } else {
            // Select the team data that belongs to the current client
            const team = data.teams.find(t => t.isSession)
            dispatch(appState.updateTeamIdAction(team._id))

            // Determine where to send the user
            if (!team || team.name === undefined) {
              history.replace('/authenticate')
              dispatch(appState.updateStatusAction('enteringTeam'))
            } else {
              if (team.name !== undefined && !team.verified) {
                history.replace('/quiz')
                dispatch(appState.updateStatusAction('loading'))
                dispatch(appState.updateLoadingMessageAction('Waiting for quizmaster to verify team...'))
              } else if (team.verified) {
                history.replace('/quiz')
                if (data.round && data.round.question.open) dispatch(appState.updateStatusAction('quizz'))
                else dispatch(appState.updateStatusAction('loading'))
              }
            }
          }

          if (data.open === false) {
            dispatch(appState.updateStatusAction('closed'))
          }
        }
      })
      .catch(err => {
        dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: err }))
        dispatch(appState.updateStatusAction('enteringName'))
      })
  }
}