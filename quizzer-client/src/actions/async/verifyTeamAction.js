import * as fetchState from '../fetchStateActions'
import * as adminState from '../adminStateActions'

import defaultFetch from './defaultFetch'
import fetchSession from './fetchSession'

export default function verifyTeamAction(teamid, accepted) {
  return (dispatch, getState) => {
    dispatch(fetchState.updateFetchAction({ fetching: true, result: null, message: null }))

    defaultFetch(`/rooms/${getState().appState.currentRoomNumber}/teams/${teamid}`, 'PATCH', JSON.stringify({ verified: accepted }))
      .then(r => {
        const { APIerr, data } = r
        if (APIerr) {
          const { error } = data
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: error }))
        } else {
          dispatch(fetchState.updateFetchAction({ fetching: false, result: 'success', message: data.success }))
          if (accepted) adminState.approveTeamAction(teamid)
          else adminState.denyTeamAction(teamid)
          dispatch(fetchSession())
        }
      })
      .catch(err => {
        dispatch(fetchState.updateFetchAction({ fetching: false, result: 'error', message: err }))
      })
  }
}