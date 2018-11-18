import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification } from 'components';
import img_wellcome from 'assets/Images/img-wellcome.png';
import Form from './Form';
import * as projectActions from './actions';
import { isEmpty } from 'utils/functions';

class EditProject extends Component {
  constructor(props){
    super(props);
    this.state = {
      isWoring : false
    }
  }

  productOnSubmit = (data, files) => {
    let { projectActions, notification, profile, match } = this.props;
    let { id } = match.params;

    this.setState({isWoring: true});
    data.groupUserID = profile.info.groupUserID;
    data.memberJoins.push({
      value : profile.info.id,
      label : profile.info.fullname,
      email : profile.info.email
    })
    projectActions.updateById(id, data)
      .then(res => {
        if(!!res.error) return Promise.reject(res.error.messagse ? res.error.messagse : "UNKNOW ERROR");
        notification.s('Message', 'Update propject success');
      })
      .catch(e =>  {
        notification.e('Message', e.toString());
      })
      .finally(() => this.setState({isWoring: false}));
  }

  removeFileUpload = (nameF) => {
    let { projectActions, notification, match } = this.props;
    let { id } = match.params;

    !!nameF && nameF !=="" && projectActions.removeFile(nameF, id)
      .then(res => {
        if(!!res.error) return Promise.reject(res.error.messagse ? res.error.messagse : "UNKNOW ERROR");
        else notification.s("Message", "Remove file success")
      })
      .catch(e => notification.e("Error", e));
  }

  fileUpload = (files) =>{
    let { projectActions, notification, match } = this.props;
    let { id } = match.params;
    let form = new FormData();
    if('push' in files && !isEmpty(files)){
      files.forEach(file => form.append('file', file));
    }

    projectActions.uploadFile(form, id)
      .then(res => {
        if(!!res.error) return Promise.reject(res.error.messagse ? res.error.messagse : "UNKNOW ERROR");
        else notification.s("Message", "Upload file success")
      })
      .catch(e => notification.e("Error", e));

  }

  render() {
    let { friends, match, project, profile } = this.props;
    let { isWoring } = this.state;
    let { id } = match.params;

    let dataProject = project.data[id];
    if(!dataProject || dataProject.createAt !== profile.info.id) return null;
    if(!profile || profile.info.account_type !== 1) return null;
    let fl = false;
    
    for(let v of dataProject.memberJoins){
      if(v.value === profile.info.id){
        fl = true;
        break;
      }
    }

    let memberJoins = [];
    for(let v of dataProject.memberJoins){
      if(v.value !== profile.info.id) memberJoins.push(v)
    }
    dataProject.memberJoins = memberJoins;

    if(profile.info.id !== dataProject.createAt && !fl) return null;

    return (
      <div className="white-box">
        <div className="col-xs-3">
          <img alt="img" src={img_wellcome} />
        </div>
        <div className="col-xs-9 m-t-30">
          <h2 className="box-title">Edit infomation project</h2>
          <p>Start assigning and completing the work of yourself and your colleagues.</p>
        </div>
        <div className="clear"></div>
        <hr />
        <Scrollbars className={`hiddenOverX ${!!isWoring ? 'loading' : ''}`} style={{height: '65vh'}}>
          <Form
            productOnSubmit   = { this.productOnSubmit }
            dataProject       = { dataProject }
            removeFileUpload  = { this.removeFileUpload }
            fileUpload        = { this.fileUpload }
            friends           = { friends } />
        </Scrollbars>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { profile, project } = state;
  let { friends } = state.categories;

  return { profile, friends, project };
};

let mapDispatchToProps = (dispatch) => {
  return {
    projectActions       : bindActionCreators(projectActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(EditProject));