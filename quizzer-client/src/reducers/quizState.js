import {
  SET_QUESTION,
  SET_ROUND,
  SET_ANSWER
} from '../actions/types'

// Default state
const initialState = {
  round: 0
}

export default function quizStateReducer(state = initialState, action) {
  switch (action.type) {
    case SET_QUESTION: {
      const changes = {
        question: action.payload
      }
      return {
        ...state,
        ...changes
      }
    }
    case SET_ROUND: {
      const changes = {
        round: action.payload
      }
      return {
        ...state,
        ...changes
      }
    }
    case SET_ANSWER: {
      const changes = {
        answer: action.payload
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