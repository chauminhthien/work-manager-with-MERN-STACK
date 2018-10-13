// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Switch, Route, withRouter } from 'react-router-dom';

import DashboardAsync from './DashboardAsync';
import AuthRoute from './AuthRoute';
import * as sessionActions from 'modules/session/actions';

import {
  LoginPageAsync,
  ForgotPasswordAsync,
  AccessPasswordAsync
} from 'modules';


class Routes extends React.Component<Props> {

  render() {
    let { session } = this.props;
    let signedIn    = (session.token != null);
    let url         = `/login?return=${window.location.href}`;

    return (
      <Switch>
        <Route path='/forgotpassword' component={ ForgotPasswordAsync } />
        <Route path='/login' component={ LoginPageAsync } />
        <Route path='/access-password/:token' component={ AccessPasswordAsync } />
        <AuthRoute path='/' signedIn={ signedIn } redirect={ url } component={ DashboardAsync } />
      </Switch>
    );
  }
};


let mapStateToProps = (state) => {
  let { session } = state;
  return { session };
};

let mapDispatchToProps = (dispatch) => {
  return {
    sessionActions    : bindActionCreators(sessionActions, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes));