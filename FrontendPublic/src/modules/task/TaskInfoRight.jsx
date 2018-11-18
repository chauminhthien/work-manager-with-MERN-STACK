import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification } from 'components';

import { actions as projectActions } from 'modules/project';
import * as taskActions from './actions';
import { actions as cateTaskActions } from 'modules/categories/cateTask';
import users        from 'assets/Images/user.jpg';

class TaskInfoRight extends Component {

  componentDidMount(){

    let { profile, project, cateTask, projectActions, taskActions } = this.props;

    if(project.ordered.length === 0){
      projectActions.fetchAll({
      },0, 0, {
        groupUserID: profile.info.groupUserID
      })
    }
    
    taskActions.fetchAll({
      order: "id DESC"
    },0 ,15, { groupUserID: profile.info.groupUserID });

    if(cateTask.ordered.length === 0) cateTaskActions.fetchAll({},0 , 15, { groupUserID: profile.info.groupUserID })
    
  }

  render() {
    let { match, profile, task, friends } = this.props;
    let { id } = match.params;
    
    let dataTask = task.data[id];
    if(!dataTask || (profile.info.id !== dataTask.createAt && profile.info.id !== dataTask.memberId)) return null;

    let memberJob = dataTask.memberId === profile.info.id
      ? profile.info : (!!friends.data[dataTask.memberId] ? friends.data[dataTask.memberId] : null );
    if(!!memberJob && !memberJob.avatar) memberJob.avatar = users;

    let memberAss = dataTask.createAt === profile.info.id
      ? profile.info : (!!friends.data[dataTask.createAt] ? friends.data[dataTask.createAt] : null );
    if(!!memberAss && !memberAss.avatar) memberAss.avatar = users;
    
    return (

      <div className="white-box">
        <h3 className="box-title m-b-0 fs-14 br-b">
          <i className="mdi mdi-emoticon m-r-5"></i>
            Are you feeling?
          <span className="clearfix"></span>
        </h3>
        <div className="col-md-12 m-t-15">
          <select className="form-control">
            <option value="">Không cảm xúc</option>
          </select>
          <span className="clearfix"></span>
        </div>
        
        <span className="clearfix"></span>
        <h3 className="box-title m-b-0 fs-14 br-b m-t-15">
          <i className="fa fa-user m-r-5"></i>
            Member of job?
          <span className="clearfix"></span>
        </h3>
        <div className="col-md-12 m-t-15">
          <ul className="chatonline">
            <li style={{lineHeight: '30px'}}>
              <img src={memberJob ? memberJob.avatar : users} alt="user-img" className="img-circle" />
              <span>{memberJob ? memberJob.fullname : ""}</span>
            </li>
          </ul>
          <span className="clearfix"></span>
        </div>
        
        <span className="clearfix"></span>
        <h3 className="box-title m-b-0 fs-14 br-b m-t-15">
          <i className="fa fa-user m-r-5"></i>
            Member assign?
          <span className="clearfix"></span>
        </h3>
        <div className="col-md-12 m-t-15">
          <ul className="chatonline">
            <li style={{lineHeight: '30px'}}>
              <img src={memberAss ? memberAss.avatar : users} alt="user-img" className="img-circle" />
              <span>{memberAss ? memberAss.fullname : ""}</span>
            </li>
          </ul>
          <span className="clearfix"></span>
        </div>

        <span className="clearfix"></span>
      </div>

    );
  }
}


let mapStateToProps = (state) => {
  let { profile, project, task } = state;
  let { friends, cateTask }           = state.categories
  return { profile, project, friends, cateTask, task };
};

let mapDispatchToProps = (dispatch) => {
  return {
    projectActions       : bindActionCreators(projectActions, dispatch),
    taskActions          : bindActionCreators(taskActions, dispatch),
    cateTaskActions      : bindActionCreators(cateTaskActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(TaskInfoRight));