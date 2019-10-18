import React from 'react'
import TeamApp from '../containers/teamapp'
import AdminApp from '../containers/adminapp'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

export default function Quizzer() {
  return <BrowserRouter>
    <Switch>
      <Route path="/admin" component={AdminApp} />
      <Route path="/" component={TeamApp} />
    </Switch>
  </BrowserRouter>
}