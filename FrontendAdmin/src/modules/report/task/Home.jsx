import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactToExcel from 'react-html-table-to-excel';

import Item from './Item';
import { withNotification } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import * as taskActions from './actions';
import { actions as projectActions} from 'modules/report/project';
import { actions as userActions } from 'modules/user';
import { rmv } from 'utils/functions';

class Home extends Component {
  _statusProject  = null;
  _taskSearch     = null;
  _userTask       = null;

  constructor(props){
    super(props);
    this.state = {
      taskSearch    : null,
      statusProject : "",
      userTask      : "ALL"
    }
  }

  componentDidMount(){
    let { breadcrumbActions, profile, projectActions, taskActions, userActions } = this.props;
    let where = { groupUserID: profile.info.groupUserID };


    projectActions.fetchAll({}, 0, 0, where);
    taskActions.fetchAll({}, 0, 0, where);
    userActions.fetchAll({}, 0, 0, where);

    breadcrumbActions.set({
      page_name: 'Report task',
      breadcrumb: [{name: "Report"}, {name: "Task", liClass: "active"}]
    });
    
  }

  taskSearchChange = () => {
    let taskSearch  = !!this._taskSearch ? this._taskSearch.value : "";
    taskSearch      = rmv(taskSearch.trim());
    
    this.setState({taskSearch});
  }

  statusChange = () => {
    let statusProject  = !!this._statusProject ? this._statusProject.value : "";
    this.setState({statusProject});
  }

  userTaskChange = () => {
    let userTask  = !!this._userTask ? this._userTask.value : "";
    this.setState({userTask});
  }

  checkJobStatus = (obj) => {
    let { statusProject, data } = obj;
    let now = Date.now();

    switch(statusProject){
      case "ALL":  return true;
      case "PENDING":  return now >= data.begin && now <= data.end && data.process < 100;
      case "COM":  return data.process === 100;
      case "NOTIMPLLE": return now < data.begin && data.process < 100;
      case "NOTCOM": return now > data.end && data.process < 100;
      case "DONE": return !!data.finish;
      default: return true;
    }
  }

  render() {
    let { task, project, users }          = this.props;
    let { data, ordered } = task;
    let { taskSearch, statusProject, userTask } = this.state;
    let orderTask = [];

    ordered.forEach(e => {
      let nameProject = !!data[e] ? data[e].name : "";
      nameProject     = rmv(nameProject);
      
      let flag = (taskSearch == null || nameProject.indexOf(taskSearch) !== -1);
      flag = !!flag && (userTask === "ALL" || data[e].memberId === userTask);
      flag = !!flag && this.checkJobStatus({statusProject, data: data[e]});
      
      if(!!flag) orderTask.push(e);
    })

    return (
      <Fragment>
        <div className="row">
          <div className="col-md-12 col-lg-12 col-sm-12">
            <div className="panel">
              <div className="p-10 p-b-0">
                <div className="col-md-7 pull-left">
                  <div className="col-md-4">
                    <select onChange={ this.statusChange } ref={ e=> this._statusProject = e} className="form-control">
                      <option value="ALL">All</option>
                      <option value="PENDING">Pending</option>
                      <option value="COM">Complete</option>
                      <option value="NOTCOM">Not complete</option>
                      <option value="NOTIMPLLE">Not implemented yet</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <select onChange={ this.userTaskChange } ref={ e => this._userTask = e} className="form-control">
                      <option value="ALL">All user</option>
                      {
                        !!users && !!users.ordered && users.ordered.map(e => {
                          return (
                            <option key={e} value={e}>{!!users.data[e] ? users.data[e].fullname : ""}</option>
                          )
                        })

                      }
                      
                    </select>
                  </div>

                  <div className="col-md-4">
                    <ReactToExcel
                      className   = "btn btn-flat btn-info"
                      filename    = "List task"
                      sheet       = "Sheet 1"
                      buttonText  = "Export to excel"
                      table       = "listPolicies" />
                  </div>
                </div>

                <div className="col-md-5 pull-right">
                  <input ref={ e => this._taskSearch = e } onChange={ this.taskSearchChange } className="form-control" placeholder="Enter keywork" />
                </div>
              </div>
              <div className="clear"></div>
              <hr style={{marginTop: '10px'}}/>
              <div className="table-responsive">
                <table id="listPolicies" className="table table-hover manage-u-table">
                  <thead>
                    <tr>
                      <th width="50px" className="text-center">STT</th>
                      <th>Name task</th>
                      <th>Project</th>
                      <th className="text-center" width="100px">Member Join</th>
                      <th className="text-center" width="100px">Begin day</th>
                      <th className="text-center" width="100px">End day</th>
                      <th className="text-center" width="100px">Status</th>
                      <th className="text-center" width="100px">Time Finish</th>
                      <th className="text-center" width="50px">Point</th>
                      <th className="text-center" width="100px">Action</th>
                     
                      
                    </tr>
                  </thead>
                  <Item
                    data              = { data }
                    users             = { users }
                    project           = { project }
                    ordered           = { orderTask }/>
                </table>
              </div>
              
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}


let mapStateToProps = (state) => {
  let { profile, report, users } = state;
  let { project, task } = report;
  return { profile, project, task, users };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions : bindActionCreators(breadcrumbActions, dispatch),
    taskActions       : bindActionCreators(taskActions, dispatch),
    projectActions    : bindActionCreators(projectActions, dispatch),
    userActions       : bindActionCreators(userActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(Home));