import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import TeamApp from '../containers/teamapp'
import AdminApp from '../containers/adminapp'
import AlertBar from '../components/alertbar'

export default function Quizzer() {
  return <BrowserRouter>
    <AlertBar message="Something went wrong" />
    <Switch>
      <Route path="/admin" component={AdminApp} />
      <Route path="/" component={TeamApp} />
    </Switch>
  </BrowserRouter>
}