import {
  UPDATE_FETCHING_MESSAGE
} from '../types'

export default function updateFetchingMessageAction(message) {
  return {
    type: UPDATE_FETCHING_MESSAGE,
    payload: message
  }
}