import {
  UPDATE_APP_STATUS,
  UPDATE_AFTER_LOADING_STATUS,
  UPDATE_LOADING_MESSAGE,
  UPDATE_ROOM_NUMBER,
  UPDATE_ROOM_NAME
} from '../actions/types'

// Default state
const initialState = {
  status: 'enteringRoom',
  statusAfterLoading: 'enteringTeam',
  loadingMessage: null,
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
    case UPDATE_AFTER_LOADING_STATUS: {
      const changes = {
        statusAfterLoading: action.payload
      }
      return {
        ...state,
        ...changes
      }
    }
    case UPDATE_LOADING_MESSAGE: {
      const changes = {
        loadingMessage: action.payload
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