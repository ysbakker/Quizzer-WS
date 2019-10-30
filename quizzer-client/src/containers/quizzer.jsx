import React from 'react'
import { connect } from 'react-redux'
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import TeamApp from './teamapp'
import AdminApp from './adminapp'
import AlertBar from '../components/alertbar'

import * as GLOBALS from '../globals'

export const history = createBrowserHistory()

class Quizzer extends React.Component {
  componentDidMount() {
    // Fetch game state from server
    fetch(`${GLOBALS.API_URL}`, {
      method: 'GET',
      cache: 'no-cache',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json()
        .then(parsed => {
          if (!res.ok) throw parsed
        })
        .catch(parsed => {
          const { error } = parsed
        })
      )
      .catch(err => {
        console.log('fetch error: ', err)
      })
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

export default connect(mapStateToProps)(Quizzer)