import React from 'react'
import { connect } from 'react-redux'
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import TeamApp from './teamapp'
import AdminApp from './adminapp'
import AlertBar from '../components/alertbar'

import recoverStateAction from '../actions/async/recoverStateAction'

export const history = createBrowserHistory()

class Quizzer extends React.Component {
  componentDidMount() {
    this.props.recoverState()
  }

  render() {
    const { props } = this
    return <Router history={history}>
      {props.fetchState.result !== null
        ? <AlertBar
          message={props.fetchState.message === null ? 'Something went wrong' : props.fetchState.message}
          success={props.fetchState.result === 'success'}
        />
        : null}
      {props.fetchState.fetching ? <img className="fetching-indicator" src="/img/fetching.svg" alt="loading spinner to indicate fetching state" /> : null}
      <Switch>
        <Route path="/quizmaster" component={AdminApp} />
        <Route path="/:roomid" component={TeamApp} />
        <Route path="/" component={TeamApp} />
      </Switch>
    </Router>
  }
}

function mapStateToProps(state) {
  return {
    fetchState: state.fetchState
  }
}

function mapDispatchToProps(dispatch) {
  return {
    recoverState: () => dispatch(recoverStateAction())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Quizzer)