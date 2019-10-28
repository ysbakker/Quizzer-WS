import {
  UPDATE_APP_STATUS,
  UPDATE_LOADING_MESSAGE,
  UPDATE_ROOM_NUMBER,
  UPDATE_ROOM_NAME,
  UPDATE_TEAM_ID,
  UPDATE_TEAM_NAME
} from '../actions/types'

// Default state
const initialState = {
  status: 'enteringRoom',
  loadingMessage: null,
  currentRoomNumber: null,
  currentRoomName: null,
  teamId: null,
  teamName: null
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
    default:
      return state;
  }
}