import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import Home from './Home';
import Detail from './Detail';
import { Error404 } from 'modules';

class Project extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/report/task" component={ Home } />
        <Route path="/report/task/:id" component={ Detail } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}

export default withRouter(Project);