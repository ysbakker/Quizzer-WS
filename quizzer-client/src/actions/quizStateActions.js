import {
  SET_QUESTION,
  SET_ROUND,
  SET_ANSWER
} from './types'

export const setQuestionAction = question => {
  return {
    type: SET_QUESTION,
    payload: question
  }
}

export const setRoundAction = round => {
  return {
    type: SET_ROUND,
    payload: round
  }
}

export const setAnswer = answer => {
  return {
    type: SET_ANSWER,
    payload: answer
  }
}