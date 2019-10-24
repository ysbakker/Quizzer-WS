import {
  UPDATE_ON_SUCCESS_STATUS
} from '../types'

export default function updateOnSuccessStatusAction(status) {
  return {
    type: UPDATE_ON_SUCCESS_STATUS,
    payload: status
  }
}