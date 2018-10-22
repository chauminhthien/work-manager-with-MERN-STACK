import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import List from './List';

class CateTask extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/categories/cate-task" component={ List } />
      </Switch>
    );
  }
}
export default withRouter(CateTask);