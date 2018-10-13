import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import img_wellcome from 'assets/Images/img-wellcome.png';
import Form from './Form';

class FormProject extends Component {

  render() {
    let { friends } = this.props;
    return (
      <div className="white-box">
        <div className="col-xs-3">
          <img alt="img" src={img_wellcome} />
        </div>
        <div className="col-xs-9 m-t-30">
          <h2 className="box-title">Create new project</h2>
          <p>Start assigning and completing the work of yourself and your colleagues.</p>
        </div>
        <div className="clear"></div>
        <hr />
        <Scrollbars className="hiddenOverX" style={{height: '65vh'}}>
          <Form 
            friends = { friends }/>
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
    
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormProject);