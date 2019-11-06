import {
  UPDATE_FETCHSTATE
} from '../actions/types'

// Default state
const initialState = {
  fetching: false,
  result: null,
  message: null,
}

export default function fetchStateReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_FETCHSTATE: {
      const changes = action.payload
      return {
        ...state,
        ...changes
      }
    }
    default:
      return state;
  }
}