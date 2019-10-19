import {
  UPDATE_APP_STATUS,
  UPDATE_ROOM_NUMBER,
  UPDATE_ROOM_NAME
} from '../actions/types'

// By default, the user hasn't entered a room number yet.
const initialState = {
  status: 1,
  currentRoomNumber: null,
  currentRoomName: null
}

export default function updateAppStateReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_APP_STATUS: {
      const changes = {
        status: action.payload
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