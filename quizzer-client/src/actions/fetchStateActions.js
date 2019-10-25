import {
  UPDATE_FETCHING,
  UPDATE_FETCHING_MESSAGE,
  UPDATE_FETCHING_RESULT
} from './types'

export function updateFetchingAction(bool) {
  return {
    type: UPDATE_FETCHING,
    payload: bool
  }
}

export function updateFetchingMessageAction(message) {
  return {
    type: UPDATE_FETCHING_MESSAGE,
    payload: message
  }
}

export function updateFetchingResultAction(result) {
  return {
    type: UPDATE_FETCHING_RESULT,
    payload: result
  }
}