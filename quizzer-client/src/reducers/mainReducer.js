import {
  combineReducers
} from 'redux'

import updateStatusReducer from './updateStatus'

export const mainReducer = combineReducers({
  TeamApp: updateStatusReducer,
  AdminApp: updateStatusReducer
})