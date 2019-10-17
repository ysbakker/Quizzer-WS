import {
  UPDATE_LANDING_STATUS,
  UPDATE_ROOM_NUMBER,
  UPDATE_ROOM_NAME
} from '../actions/types'

export default function updateStatusReducer(state = null, action) {
  switch (action.type) {
    case UPDATE_LANDING_STATUS: {
      const changes = {
        landingStatus: action.payload
      }
      return {
        ...state,
        ...changes
      }
    }
    case UPDATE_ROOM_NUMBER: {
      const changes = {
        currentRoomNumber: action.payload
      }
      return {
        ...state,
        ...changes
      }
    }
    case UPDATE_ROOM_NAME: {
      const changes = {
        currentRoomName: action.payload
      }
      return {
        ...state,
        ...changes
      }
    }
    default:
      return state;
  }
}