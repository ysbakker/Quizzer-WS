import {
  UPDATE_ROOM_PASSWORD,
  ADD_TEAM,
  DENY_TEAM,
  APPROVE_TEAM,
  CLEAR_TEAMS,
  SET_ANSWERS
} from './types'

export function updateRoomPasswordAction(password) {
  return {
    type: UPDATE_ROOM_PASSWORD,
    payload: password
  }
}

export function approveTeamAction(team) {
  return {
    type: APPROVE_TEAM,
    payload: team
  }
}

export function denyTeamAction(team) {
  return {
    type: DENY_TEAM,
    payload: team
  }
}

export function addTeamAction(team) {
  return {
    type: ADD_TEAM,
    payload: team
  }
}

export function clearTeamsAction() {
  return {
    type: CLEAR_TEAMS
  }
}

export function setAnswersAction(answers) {
  return {
    type: SET_ANSWERS,
    payload: answers
  }
}