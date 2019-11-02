import {
  SET_QUESTION,
  SET_ROUND,
  SET_ANSWER,
  SET_PICKABLE_CATS,
  ADD_CAT,
  DEL_CAT
} from './types'

export const setPickableCategoriesAction = cats => {
  return {
    type: SET_PICKABLE_CATS,
    payload: cats
  }
}

export const addCategoryAction = (cat, max) => {
  return {
    type: ADD_CAT,
    payload: cat,
    max: max
  }
}

export const deleteCategoryAction = cat => {
  return {
    type: DEL_CAT,
    payload: cat
  }
}

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