import {
  SET_QUESTION,
  SET_ROUND,
  SET_ANSWER,
  SET_PICKABLE_CATS,
  ADD_CAT,
  DEL_CAT
} from '../actions/types'

// Default state
const initialState = {
  round: 0,
  allCategories: [],
  roundCategories: []
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
    case SET_PICKABLE_CATS: {
      const changes = {
        allCategories: action.payload
      }
      return {
        ...state,
        ...changes
      }
    }
    case ADD_CAT: {
      const changes = {}
      if (!state.roundCategories.includes(action.payload)) changes.roundCategories = state.roundCategories.concat(action.payload)
      return {
        ...state,
        ...changes
      }
    }
    case DEL_CAT: {
      const changes = {
        roundCategories: state.roundCategories.filter(cat => cat !== action.payload)
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