import {
  SET_PICKABLE_QUESTIONS,
  SET_QUESTION,
  SET_ROUND,
  SET_ANSWER,
  SET_PICKABLE_CATS,
  ADD_CAT,
  DEL_CAT,
  SET_QUESTION_NR
} from './types'

export const setPickableCategoriesAction = cats => {
  return {
    type: SET_PICKABLE_CATS,
    payload: cats
  }
}

export const addCategoryAction = cat => {
  return {
    type: ADD_CAT,
    payload: cat
  }
}

export const deleteCategoryAction = cat => {
  return {
    type: DEL_CAT,
    payload: cat
  }
}
export const setPickableQuestionsAction = questions => {
  return {
    type: SET_PICKABLE_QUESTIONS,
    payload: questions
  }
}

export const setQuestionAction = question => {
  return {
    type: SET_QUESTION,
    payload: question
  }
}

export const setQuestionNrAction = nr => {
  return {
    type: SET_QUESTION_NR,
    payload: nr
  }
}

export const setRoundAction = round => {
  return {
    type: SET_ROUND,
    payload: round
  }
}

export const setAnswerAction = answer => {
  return {
    type: SET_ANSWER,
    payload: answer
  }
}