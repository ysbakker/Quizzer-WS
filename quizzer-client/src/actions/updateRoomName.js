import {
  UPDATE_ROOM_NAME
} from './types'

export default function updateRoomNameAction(name) {
  return {
    type: UPDATE_ROOM_NAME,
    payload: name
  }
}