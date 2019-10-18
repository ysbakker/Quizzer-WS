import {
  combineReducers
} from 'redux'

import updateStatusReducer from './updateAppState'

export const mainReducer = combineReducers({
  appState: updateStatusReducer,
})