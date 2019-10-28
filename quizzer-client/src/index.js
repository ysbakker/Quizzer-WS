import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import ReduxThunk from 'redux-thunk'

import Quizzer from './containers/quizzer'
import { mainReducer as reducer } from './reducers/mainReducer'

import './css/main.scss';
import './css/fonts.css';

// The logger middleware is adapted from code out of http://www.pro-react.com/materials/ch06-alt-redux.pdf.
// We use it because it is also useful to see the redux-actions happening in the normal console
// (together with error-messages).
const logger = (store) => (next) => (action) => {
  console.log('ACTION:', action.type, action);
  let result = next(action);
  console.log('STATE AFTER ACTION:', action.type, store.getState());
  return result;
}

// There are a few different ways you can connect the Redux App to the Redux DevTools.
// This code (adapted from https://github.com/zalmoxisus/redux-devtools-extension#12-advanced-store-setup)
// is the version you need if you use Redux middleware:
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer, composeEnhancers(
  applyMiddleware(logger, ReduxThunk)
))

ReactDOM.render(
  <Provider store={store}>
    <Quizzer />
  </Provider>,
  document.getElementById('root')
);