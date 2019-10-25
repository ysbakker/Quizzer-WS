import {
  UPDATE_FETCHING,
  UPDATE_FETCHING_RESULT,
  UPDATE_FETCHING_MESSAGE
} from '../actions/types'

// Default state
const initialState = {
  fetching: false,
  result: 'error',
  message: null,
}

export default function updateFetchStateReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_FETCHING: {
      const changes = {
        fetching: action.payload
      }
      return {
        ...state,
        ...changes
      }
    }
    case UPDATE_FETCHING_RESULT: {
      const changes = {
        result: action.payload
      }
      return {
        ...state,
        ...changes
      }
    }
    case UPDATE_FETCHING_MESSAGE: {
      const changes = {
        message: action.payload
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