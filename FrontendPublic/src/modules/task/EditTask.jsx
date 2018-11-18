import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification, Loading } from 'components';
import img_wellcome from 'assets/Images/img-wellcome.png';
import * as taskActions from './actions';
import { actions as cateTaskAction } from 'modules/categories/cateTask';
import { actions as projectActions } from 'modules/project';
import Form from './Form';
import { getJsonFromSearch, isEmpty } from 'utils/functions';

class EditTask extends Component {

  constructor(props){
    super(props);
    this.state = {
      isWoring : false
    }
  }

  componentWillMount(){
    let { cateTask, profile, taskActions, cateTaskAction, projectActions, project } = this.props;
    
    if(cateTask.ordered.length === 0) cateTaskAction.fetchAll({}, 0, 0, {groupUserID: profile.info.groupUserID});
    taskActions.fetchAll({
      order: "id DESC"
    },0 , 15, { groupUserID: profile.info.groupUserID })

    if(project.ordered.length === 0) projectActions.fetchAll({ },0, 0, { groupUserID: profile.info.groupUserID })
      
  }

  productOnSubmit = (data, files) => {
    let { taskActions, notification, match } = this.props;
    let { id } = match.params;
    this.setState({isWoring: true});
    
    taskActions.updateById(id, data)
      .then(res => { 
        if(!!res.error) return Promise.reject(res.error.messagse ? res.error.messagse : "UNKNOW ERROR");
        notification.s('Message', 'Update task success');
      })
      .catch(e =>  {
        notification.e('Message', e.toString());
      })
      .finally(() => this.setState({isWoring: false}));
  }

  hannelCreateSuccess = (data) => {
    let { history, notification } = this.props;

    notification.s('Message', 'Create task success');
    let url = `/task/view/${data.id}`;
    history.push(url);
  }


  fileUpload = (files) => {
    let { taskActions, notification, match } = this.props;
    let { id } = match.params;
    let form = new FormData();
    if('push' in files && !isEmpty(files)){
      files.forEach(file => form.append('file', file));
    }

    taskActions.uploadFile(form, id)
      .then(res => {
        if(!!res.error) return Promise.reject(res.error.messagse ? res.error.messagse : "UNKNOW ERROR");
        else notification.s("Message", "Upload file success")
      })
      .catch(e => notification.e("Error", e));
  }

  removeFileUpload = (nameF) => {
    let { taskActions, notification, match } = this.props;
    let { id } = match.params;

    !!nameF && nameF !=="" && taskActions.removeFile(nameF, id)
      .then(res => { 
        if(!!res.error) return Promise.reject(res.error.messagse ? res.error.messagse : "UNKNOW ERROR");
        else notification.s("Message", "Remove file success")
      })
      .catch(e => notification.e("Error", e));
  }

  render() {
    
    let { profile, task, cateTask, project,  match, location } = this.props;
    let { isWoring } = this.state;

    if(task.isWoring || cateTask.isWoring || project.isWoring) return <Loading />;
    let { id } = match.params;
    let dataTask = task.data[id];
    if(!dataTask || profile.info.id !== dataTask.createAt) return null;

    let param = getJsonFromSearch(location.search)
    if(!param || !param.project || !project.data[param.project]) return null;
    let idProject = param.project;

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
          <Form 
            task              = { task }
            idProject         = { idProject }
            project           = { project }
            productOnSubmit   = { this.productOnSubmit }
            dataTask          = { dataTask }
            fileUpload        = { this.fileUpload }
            removeFileUpload  = { this.removeFileUpload }
            cateTask          = { cateTask } />
        </Scrollbars>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { profile, task, project } = state;
  let { friends, cateTask } = state.categories;

  return { profile, friends, cateTask, task, project };
};

let mapDispatchToProps = (dispatch) => {
  return {
    taskActions       : bindActionCreators(taskActions, dispatch),
    cateTaskAction    : bindActionCreators(cateTaskAction, dispatch),
    projectActions    : bindActionCreators(projectActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(EditTask));