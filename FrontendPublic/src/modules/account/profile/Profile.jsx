import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import { actions as profileActions } from 'modules/account';
import * as fileConfig from 'config/fileConfig';
import Left from './Left';
import Right from './Right';

class Profile extends Component {

  componentWillMount(){
    this.props.breadcrumbActions.set({
      page_name: 'Edit profile',
      breadcrumb: [{
        name: "Profile",
        liClass: "active"
      }]
    });
  }

  uploadFile = (file) => {
    let { notification, profileActions, profile } = this.props;

    let { id } = profile.info;

    if(fileConfig.acceptTypeFile.indexOf(file.type) !== -1){
      if(fileConfig.maxFilesize >= file.size){
        let formData = new FormData();
        formData.append('file', file);

        profileActions.uploadAvatar(formData, id)
          .then(res => {
            if(!!res.error) return Promise.reject(res.error)
            notification.s('Message', 'Update avatar success');
          }, e => Promise.reject(e))
          .catch(e => notification.e('Error', e.messagse));
        
      } else notification.e('Error', 'File size invalid');
    } else notification.e('Error', 'Type file invalid');
  }

  render() {
    let { profile } = this.props;

    return (
      <div className="p-l-15 m-t-15">
        <Left uploadFile = { this.uploadFile } profile={profile} />
        <Right profile={profile} />
      </div>
    );
  }
}


let mapStateToProps = (state) => {
  let { profile } = state;
  return { profile };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions       : bindActionCreators(breadcrumbActions, dispatch),
    profileActions : bindActionCreators(profileActions, dispatch)
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(Profile));