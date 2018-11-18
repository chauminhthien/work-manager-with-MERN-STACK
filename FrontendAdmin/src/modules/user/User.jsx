import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import ListUser from './ListUser';
import { Error404 } from 'modules';

class User extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/users" component={ ListUser } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}
export default withRouter(User);