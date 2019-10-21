import {
  UPDATE_AFTER_LOADING_STATUS
} from './types'

export default function updateAfterLoadingStatusAction(status) {
  return {
    type: UPDATE_AFTER_LOADING_STATUS,
    payload: status
  }
}