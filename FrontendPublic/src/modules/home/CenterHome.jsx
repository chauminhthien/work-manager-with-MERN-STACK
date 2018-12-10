import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification } from 'components';

import img_wellcome from 'assets/Images/img-wellcome.png';
import ListTask from './ListTask';
import { Form as FormAddTask } from 'modules/task';
import { actions as cateTaskAction } from 'modules/categories/cateTask';
import { actions as projectActions } from 'modules/project';
import { actions as taskActions } from 'modules/task';

import { isEmpty, rmv } from 'utils/functions';

class CenterHome extends Component {
  _changNameNewTask = null;

  constructor(props){
    super(props);
    this.state = {
      nameTask    : null,
      taskSearch  : null,
      isWoring    : false,
      jobType     : null,
      jobStatus   : "ALL"
    }
  }

  componentWillMount(){
    let { cateTask, task, profile, taskActions, cateTaskAction, projectActions, project } = this.props;
    
    if(cateTask.ordered.length === 0) cateTaskAction.fetchAll({}, 0, 0, {groupUserID: profile.info.groupUserID});
    if(task.ordered.length === 0) taskActions.fetchAll({
      order: "id DESC"
    },0 , 15, { groupUserID: profile.info.groupUserID })

    if(project.ordered.length === 0) projectActions.fetchAll({ },0, 0, { groupUserID: profile.info.groupUserID })
      
  }

  productOnSubmit = (data, files) => {
    let { taskActions, notification, profile } = this.props;
    this.setState({isWoring: true});
    data.groupUserID  = profile.info.groupUserID;
    data.createAt     =  profile.info.id;
    
    taskActions.create(data)
      .then(res => {
        if(!!res.error) return Promise.reject(res.error.messagse);
        if(!!files) return taskActions.uploadFile(files, res.data.id);
        else this.hannelCreateSuccess(res.data);
      })
      .then(file => {
        if(!!file && !!file.error) return Promise.reject(file.error.messagse);
        if(!!file && !!file.data)  this.hannelCreateSuccess(file.data);
      })
      .catch(e =>  {
        this.setState({isWoring: false});
        notification.e('Message', e.toString());
        this.setState({isWoring: false})
      })
  }

  hannelCreateSuccess = (data) => {
    let { history, notification } = this.props;

    notification.s('Message', 'Create task success');
    let url = `/task/view/${data.id}?project=${data.projectId}`;
    history.push(url);
  }

  changNameNewTask = () => {
    let nameTask = !!this._changNameNewTask ? this._changNameNewTask.value : "";
    nameTask = nameTask.trim();
    
    if(nameTask.length >= 3){
      this.setState({nameTask})
    }else this.setState({nameTask: null})
  }

  taskSearchChange = (input) => () => {
    let taskSearch  = !!input ? input.value : "";
    taskSearch      = rmv(taskSearch.trim());
    
    this.setState({taskSearch});
  }

  jobTypeChane = (input) => () => {
    let jobType = !!input ? input.value : null;
    if(!jobType || jobType === "-1") jobType = null;
    this.setState({jobType})
  }

  jobStatusChange = (val) => () => {
    let jobStatus = !!val ? val : "ALL";
    this.setState({jobStatus})
  }

  checkJobType = (obj) => {
    let { profile, jobType, data } = obj;

    if(jobType == null) return true;

    if(jobType === "1") return (profile.info.id === data.createAt);
    if(jobType === "0") return (profile.info.id === data.memberId)

    return true;
  }

  checkJobStatus = (obj) => {
    let { jobStatus, data } = obj;
    let now = Date.now();
    
    switch(jobStatus){
      case "ALL":  return true;
      case "NEW": return now < data.begin && data.process < 100;
      case "SLOW": return now > data.end && data.process < 100;
      case "PENDING": return now >= data.begin && now <= data.end && data.process < 100;
      case "COMPLETE": return data.process === 100;
      default: return true;
    }
  }

  checkJob = (obj) => {
    let { profile, data } = obj;
    if(profile.info.account_type === 1) return true;

    let fl = false;
    for(let val of data.relateMember){ 
      if(val.value === profile.info.id) {
        fl = true;
        break;
      }
    }

    return (data.createAt === profile.info.id || data.memberId === profile.info.id || !!fl)
  }

  render() {
    let { nameTask, taskSearch, jobType, jobStatus } = this.state;
    let { cateTask, project, task, friends, profile } = this.props;

    let orderTask = [];

    task.ordered.forEach(e => {
      let nameTask = !!task.data[e] ? task.data[e].name : "";
      nameTask = rmv(nameTask);
      
      let flag = (taskSearch == null || nameTask.indexOf(taskSearch) !== -1);

      flag = !!flag && this.checkJobType({profile, jobType, data: task.data[e]});
      flag = !!flag && this.checkJobStatus({profile, jobStatus, data: task.data[e]});
      flag = !!flag && this.checkJob({profile, data: task.data[e]});
      
      if(!!flag) orderTask.push(e);
    })

    return (
      <div className="white-box">
        <div className="top">
          <div className="col-xs-3">
            <img alt="img" src={img_wellcome} />
          </div>
          <div className="col-xs-9 m-t-30">
            <h2 className="box-title">Manage your daily work</h2>
            <p>Start assigning and completing the work of yourself and your colleagues.</p>
          </div>
          
          <div className="clear"></div>

          <div className="col-xs-12 m-t-15 p-0">
            <form className="form-horizontal">
              <div className="form-group">
                <div className="col-sm-12">
                    {
                      !!profile && !!profile.info.account_type && profile.info.account_type === 1 && !nameTask && (
                        <div className="input-group br-b">
                          <div className="input-group-addon no-bg no-br ">
                            <i style={{color: '#00c23f', fontSize: '18px' }} className="fa fa-plus" />
                          </div>
                          <input 
                            ref       = {e => this._changNameNewTask = e}
                            onChange  = { this.changNameNewTask }
                            type      = "text"
                            className="form-control no-br no-outline"
                            placeholder="Name work" />
                          
                        </div>
                      )
                    }
                  
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="clear"></div>
        {
          !!nameTask 
          ? (
              <Scrollbars className="hiddenOverX" style={{ height: "60vh" }}>
                <FormAddTask
                  dataTask        = {{ name: nameTask }}
                  cateTask        = { cateTask }
                  productOnSubmit = { this.productOnSubmit }
                  homeCancel      = { () => this.setState({nameTask: null})}
                  project         = { project } />
              </Scrollbars>
            )
          : <ListTask 
            taskSearchChange = { this.taskSearchChange }
            data             = { task.data }
            cateTask         = { cateTask }
            friends          = { friends }
            isEmpty          = { isEmpty }
            jobTypeChane     = { this.jobTypeChane }
            jobStatusChange  = { this.jobStatusChange }
            jobStatus        = { jobStatus }
            profile          = { profile }
            ordered          = { orderTask } />
        }
        
        
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
    projectActions    : bindActionCreators(projectActions, dispatch)
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(CenterHome));