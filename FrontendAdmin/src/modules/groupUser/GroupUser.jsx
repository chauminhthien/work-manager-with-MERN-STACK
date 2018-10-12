import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import List from './List';

class GroupUser extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/group-user" component={ List } />
      </Switch>
    );
  }
}
export default withRouter(GroupUser);