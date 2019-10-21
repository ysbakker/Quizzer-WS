import {
  UPDATE_LOADING_MESSAGE
} from './types'

export default function updateLoadingMessageAction(message) {
  return {
    type: UPDATE_LOADING_MESSAGE,
    payload: message
  }
}