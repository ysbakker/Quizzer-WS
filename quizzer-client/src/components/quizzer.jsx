import React from 'react'
import TeamApp from '../containers/teamapp'
import AdminApp from '../containers/adminapp'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

export default function Quizzer() {
  return <BrowserRouter>
    <Switch>
      <Route exact path="/admin/:roomid" component={AdminApp} />
      <Route exact path="/admin" component={AdminApp} />
      <Route exact path="/:roomid" component={TeamApp} />
      <Route exact path="/" component={TeamApp} />
    </Switch>
  </BrowserRouter>
}