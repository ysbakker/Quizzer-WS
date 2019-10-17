import React from 'react';
import ReactDOM from 'react-dom';
import {
  Provider
} from 'react-redux';

import Quizzer from './components/quizzer';
import {
  mainReducer as reducer
} from './reducers/mainReducer'

import './css/main.scss';
import './css/fonts.css';

import {
  createStore
} from 'redux'

const store = createStore(reducer)

ReactDOM.render(
  <Provider store={store}>
    <Quizzer />
  </Provider>,
  document.getElementById('root')
);