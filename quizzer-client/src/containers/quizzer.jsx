import React from 'react'
import { connect } from 'react-redux'
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import TeamApp from './teamapp'
import AdminApp from './adminapp'
import AlertBar from '../components/alertbar'

import fetchSession from '../actions/async/fetchSession'

export const history = createBrowserHistory()

class Quizzer extends React.Component {
  componentDidMount() {
    this.props.fetchSession(true)
  }

  render() {
    const { props } = this

    // Display when the quiz is closed
    if (props.appState.status === 'closed') {
      return <h1>Quiz closed!</h1>
    }
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
    fetchState: state.fetchState,
    appState: state.appState,
    quizState: state.quizState
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSession: recover => dispatch(fetchSession(recover))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Quizzer)