import {
  UPDATE_FETCHSTATE
} from './types'

export function updateFetchAction(fetchState) {
  return {
    type: UPDATE_FETCHSTATE,
    payload: fetchState
  }
}