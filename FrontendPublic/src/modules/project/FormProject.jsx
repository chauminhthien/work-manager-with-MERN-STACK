import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification } from 'components';
import img_wellcome from 'assets/Images/img-wellcome.png';
import Form from './Form';
import * as projectActions from './actions';

class FormProject extends Component {
  constructor(props){
    super(props);
    this.state = {
      isWoring : false
    }
  }
  productOnSubmit = (data, files) => {
    let { projectActions, notification, profile } = this.props;
    
    this.setState({isWoring: true});
    data.groupUserID  = profile.info.groupUserID;
    data.createAt     =  profile.info.id
    projectActions.create(data)
      .then(res => {
        if(!!res.error) return Promise.reject(res.error.messagse);
        if(!!files) return projectActions.uploadFile(files, res.data.id);
        else this.hannelCreateSuccess(res.data);
      })
      .then(file => {
        if(!!file && !!file.error) return Promise.reject(file.error.messagse);
        if(!!file && !!file.data)  this.hannelCreateSuccess(file.data);
      })
      .catch(e =>  {
        this.setState({isWoring: false});
        notification.e('Message', e.toString());
      });
  }

  hannelCreateSuccess = (data) => { console.log(data);
    let { history, notification } = this.props;

    notification.s('Message', 'Create propject success');
    let url = `/project/view/${data.id}`;
    history.push(url);
  }

  render() {
    let { friends } = this.props;
    let { isWoring } = this.state;
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
        <Scrollbars className={`hiddenOverX ${!!isWoring ? 'loading' : ''}`} style={{height: '65vh'}}>
          <Form
            productOnSubmit   = { this.productOnSubmit }
            friends           = { friends }/>
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
    projectActions       : bindActionCreators(projectActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(FormProject));