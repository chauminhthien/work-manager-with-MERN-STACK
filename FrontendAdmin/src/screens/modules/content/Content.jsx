import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import {
  HomeAsync,
  UserAsync,
  Error404,
  ProfileAsync,
  GroupUserAsync,
  CategoriesAsync,
  ReportAsync
} from 'modules';

class Content extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={ HomeAsync } />
        <Route path="/users" component={ UserAsync } />
        <Route path="/profile" component={ ProfileAsync } />
        <Route path="/group-user" component={ GroupUserAsync } />
        <Route path="/categories" component={ CategoriesAsync } />
        <Route path="/report" component={ ReportAsync } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}

export default withRouter(Content);