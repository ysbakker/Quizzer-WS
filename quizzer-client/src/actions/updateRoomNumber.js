import {
  UPDATE_ROOM_NUMBER
} from './types'

export default function updateRoomNumberAction(room) {
  return {
    type: UPDATE_ROOM_NUMBER,
    payload: room
  }
}