import {
  UPDATE_FETCHING
} from '../types'

export default function updateFetchingAction(bool) {
  return {
    type: UPDATE_FETCHING,
    payload: bool
  }
}