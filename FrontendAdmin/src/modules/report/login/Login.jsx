import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import Home from './Home';

import { Error404 } from 'modules';

class Project extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/report/login" component={ Home } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}

export default withRouter(Project);