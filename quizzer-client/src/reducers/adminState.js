import {
  UPDATE_ROOM_PASSWORD,
  APPROVE_TEAM,
  DENY_TEAM,
  ADD_TEAM,
  CLEAR_TEAMS
} from '../actions/types'

// Default state
const initialState = {
  password: null,
  approvedTeams: [],
  pendingTeams: []
}

export default function adminStateReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ROOM_PASSWORD: {
      const changes = {
        password: action.payload
      }
      return {
        ...state,
        ...changes
      }
    }
    case APPROVE_TEAM: {
      const approvedTeams = state.approvedTeams.concat(state.pendingTeams.find(team => team._id === action.payload))
      const pendingTeams = state.pendingTeams.filter(team => team._id !== action.payload)
      const changes = {
        approvedTeams: approvedTeams,
        pendingTeams: pendingTeams
      }
      return {
        ...state,
        ...changes
      }
    }
    case DENY_TEAM: {
      const pendingTeams = state.pendingTeams.filter(team => team._id !== action.payload)
      const changes = {
        pendingTeams: pendingTeams
      }
      return {
        ...state,
        ...changes
      }
    }
    case ADD_TEAM: {
      const pendingTeams = state.pendingTeams.concat(action.payload)
      const changes = {
        pendingTeams: pendingTeams
      }
      return {
        ...state,
        ...changes
      }
    }
    case CLEAR_TEAMS: {
      const changes = {
        pendingTeams: [],
        approvedTeams: []
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