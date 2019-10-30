import { combineReducers } from 'redux'

import appStateReducer from './appState'
import fetchStateReducer from './fetchState'
import adminStateReducer from './adminState'

export const mainReducer = combineReducers({
  appState: appStateReducer,
  fetchState: fetchStateReducer,
  adminState: adminStateReducer
})