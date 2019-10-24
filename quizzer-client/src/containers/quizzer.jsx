import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import TeamApp from './teamapp'
import AdminApp from './adminapp'
import AlertBar from '../components/alertbar'


function Quizzer(props) {
  return <BrowserRouter>
    {props.fetchState.result !== null
      ? <AlertBar
        message={props.fetchState.message === null ? 'Something went wrong' : props.fetchState.message}
        success={props.fetchState.result === 'success'}
      />
      : null}
    <Switch>
      <Route path="/quizmaster" component={AdminApp} />
      <Route path="/:roomid" component={TeamApp} />
      <Route path="/" component={TeamApp} />
    </Switch>
  </BrowserRouter>
}

function mapStateToProps(state) {
  return {
    fetchState: state.fetchState
  }
}

export default connect(mapStateToProps)(Quizzer)