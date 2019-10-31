import {
  UPDATE_APP_STATUS,
  UPDATE_LOADING_MESSAGE,
  UPDATE_ROOM_NUMBER,
  UPDATE_ROOM_NAME,
  UPDATE_TEAM_ID,
  UPDATE_TEAM_NAME,
  UPDATE_ROOM_PASSWORD,
  SET_SOCKET
} from '../actions/types'

// Default state
const initialState = {
  status: 'enteringRoom',
  loadingMessage: null,
  currentRoomNumber: null,
  currentRoomName: null
}

export default function appStateReducer(state = initialState, action) {
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
    case UPDATE_TEAM_ID: {
      const changes = {
        teamId: action.payload
      }
      return {
        ...state,
        ...changes
      }
    }
    case UPDATE_TEAM_NAME: {
      const changes = {
        teamName: action.payload
      }
      return {
        ...state,
        ...changes
      }
    }
    case UPDATE_ROOM_PASSWORD: {
      const changes = {
        password: action.payload
      }
      return {
        ...state,
        ...changes
      }
    }
    case SET_SOCKET: {
      const changes = {
        socket: action.payload
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