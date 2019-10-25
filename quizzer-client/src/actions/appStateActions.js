import {
  UPDATE_LOADING_MESSAGE,
  UPDATE_ON_SUCCESS_STATUS,
  UPDATE_ROOM_NAME,
  UPDATE_ROOM_NUMBER,
  UPDATE_APP_STATUS
} from './types'

export function updateLoadingMessageAction(message) {
  return {
    type: UPDATE_LOADING_MESSAGE,
    payload: message
  }
}

export function updateOnSuccessStatusAction(status) {
  return {
    type: UPDATE_ON_SUCCESS_STATUS,
    payload: status
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