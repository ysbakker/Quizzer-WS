import {
  UPDATE_FETCHING_RESULT
} from '../types'

export default function updateFetchingResultAction(result) {
  return {
    type: UPDATE_FETCHING_RESULT,
    payload: result
  }
}