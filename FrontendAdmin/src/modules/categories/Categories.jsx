import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import CateTaskAsync from './cateTask/CateTaskAsync'
import { Error404 } from 'modules';

class Content extends Component {
  render() {
    return (
      <Switch>
        <Route path="/categories/cate-task" component={ CateTaskAsync } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}

export default withRouter(Content);