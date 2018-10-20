import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification } from 'components';
import img_wellcome from 'assets/Images/img-wellcome.png';
import * as taskActions from './actions';

import Form from './Form';

class NewTask extends Component {

  render() {
    let isWoring = false;
    return (
      <div className="white-box">
        <div className="col-xs-3">
          <img alt="img" src={img_wellcome} />
        </div>
        <div className="col-xs-9 m-t-30">
          <h2 className="box-title">Create new task</h2>
          <p>Start assigning and completing the work of yourself and your colleagues.</p>
        </div>
        <div className="clear"></div>
        <hr />
        <Scrollbars className={`hiddenOverX ${!!isWoring ? 'loading' : ''}`} style={{height: '65vh'}}>
          <Form />
        </Scrollbars>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { profile } = state;
  let { friends } = state.categories;

  return { profile, friends };
};

let mapDispatchToProps = (dispatch) => {
  return {
    taskActions       : bindActionCreators(taskActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(NewTask));