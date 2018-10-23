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

class NewTask extends Component {

  componentWillMount(){
    let { cateTask, task, profile, taskActions, cateTaskAction, projectActions, project } = this.props;
    
    if(cateTask.ordered.length === 0) cateTaskAction.fetchAll({}, 0, 0, {groupUserID: profile.info.groupUserID});
    if(task.ordered.length === 0) taskActions.fetchAll({}, 0, 0, {groupUserID: profile.info.groupUserID});

    if(project.ordered.length === 0) projectActions.fetchAll({ },0, 0, { groupUserID: profile.info.groupUserID })
      
  }

  render() {
    let isWoring = false;
    let { task, cateTask, project,  match } = this.props;
    if(task.isWoring || cateTask.isWoring || project.isWoring) return <Loading />;
    let { id } = match.params;

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
            task      = { task }
            idProject = { id }
            project   = { project }
            cateTask  = { cateTask } />
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

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(NewTask));