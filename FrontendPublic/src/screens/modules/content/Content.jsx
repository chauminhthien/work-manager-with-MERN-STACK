import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import {
  HomeAsync,
  Error404,
  ProfileAsync,
  Messagse,
  ProjectAsync
} from 'modules';

class Content extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={ HomeAsync } />
        <Route exact path="/messagse" component={ Messagse } />
        <Route path="/profile" component={ ProfileAsync } />
        <Route path="/project" component={ ProjectAsync } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}

export default withRouter(Content);