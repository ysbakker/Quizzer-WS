import {
  UPDATE_LOADING_MESSAGE,
  UPDATE_ROOM_NAME,
  UPDATE_ROOM_NUMBER,
  UPDATE_APP_STATUS,
  UPDATE_TEAM_ID,
  UPDATE_TEAM_NAME,
  SET_SOCKET
} from './types'

export function updateLoadingMessageAction(message) {
  return {
    type: UPDATE_LOADING_MESSAGE,
    payload: message
  }
}

export function updateRoomNameAction(name) {
  return {
    type: UPDATE_ROOM_NAME,
    payload: name
  }
}

export function updateRoomNumberAction(room) {
  return {
    type: UPDATE_ROOM_NUMBER,
    payload: room
  }
}

export function updateStatusAction(status) {
  return {
    type: UPDATE_APP_STATUS,
    payload: status
  }
}

export function updateTeamIdAction(id) {
  return {
    type: UPDATE_TEAM_ID,
    payload: id
  }
}

export function updateTeamNameAction(name) {
  return {
    type: UPDATE_TEAM_NAME,
    payload: name
  }
}

export function setSocketAction(socket) {
  return {
    type: SET_SOCKET,
    payload: socket
  }
}