import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import ListUser from './ListUser';
import Report from './Report';
import { Error404 } from 'modules';

class User extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/users" component={ ListUser } />
        <Route path="/users/report/:id" component={ Report } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}
export default withRouter(User);