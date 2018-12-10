import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import ProjectAsync from './project/ProjectAsync';
import TaskAsync from './task/TaskAsync';
import LoginAsync from './login/LoginAsync';
import { Error404 } from 'modules';

class Content extends Component {
  render() {
    return (
      <Switch>
        <Route path="/report/project" component={ ProjectAsync } />
        <Route path="/report/task" component={ TaskAsync } />
        <Route path="/report/login" component={ LoginAsync } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}

export default withRouter(Content);