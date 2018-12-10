import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import {
  HomeAsync,
  Error404,
  ProfileAsync,
  Messagse,
  ProjectAsync,
  NotificationAsync,
  TaskAsync,
  SchedulerAsync
} from 'modules';

class Content extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={ HomeAsync } />
        <Route exact path="/messagse" component={ Messagse } />
        <Route exact path="/scheduler" component={ SchedulerAsync } />
        <Route exact path="/notification" component={ NotificationAsync } />
        <Route path="/profile" component={ ProfileAsync } />
        <Route path="/project" component={ ProjectAsync } />
        <Route path="/task" component={ TaskAsync } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}

export default withRouter(Content);