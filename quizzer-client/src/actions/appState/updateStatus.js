import {
  UPDATE_APP_STATUS
} from '../types'

export default function updateStatusAction(status) {
  return {
    type: UPDATE_APP_STATUS,
    payload: status
  }
}