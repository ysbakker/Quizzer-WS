import {
  combineReducers
} from 'redux'

import updateAppStateReducer from './updateAppState'
import updateFetchStateReducer from './updateFetchState'

export const mainReducer = combineReducers({
  appState: updateAppStateReducer,
  fetchState: updateFetchStateReducer
})