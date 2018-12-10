import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactToExcel from 'react-html-table-to-excel';

import Item from './Item';
import { withNotification } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import * as loginActions from './actions';
import { actions as userActions } from 'modules/user';
import { rmv } from 'utils/functions';

class Home extends Component {
  _statusProject  = null;
  _taskSearch     = null;

  constructor(props){
    super(props);
    this.state = {
      taskSearch    : null,
      userTask      : "ALL",
      statusProject : "ALL"
    }
  }
  
  componentDidMount(){
    let { breadcrumbActions, profile, loginActions, userActions } = this.props;
    let where = { groupUserID: profile.info.groupUserID };


    loginActions.fetchAll({}, 0, 0, where);
    userActions.fetchAll({}, 0, 0, where);

    breadcrumbActions.set({
      page_name: 'Report Login',
      breadcrumb: [{name: "Report"}, {name: "Login", liClass: "active"}]
    });
    
  }

  checkJobStatus = (obj) => {
    let { statusProject, data } = obj;

    switch(statusProject){
      case "ALL":  return true;
      case "0": return !data.type;
      case "1": return !!data.type;
      default: return true;
    }
  }

  userTaskChange = () => {
    let userTask  = !!this._userTask ? this._userTask.value : "";
    this.setState({userTask});
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

  render() {
    let { login, users } = this.props;
    let { data, ordered } = login;
    let { taskSearch, statusProject, userTask } = this.state;
    let orderTask = [];

    ordered.forEach(e => {
      let nameProject = !!data[e] ? data[e].name : "";
      nameProject     = rmv(nameProject);
      
      let flag = (taskSearch == null || nameProject.indexOf(taskSearch) !== -1);
      flag = !!flag && this.checkJobStatus({statusProject, data: data[e]});
      flag = !!flag && (userTask === "ALL" || data[e].userId === userTask);
      
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
                      <option value="0">Login</option>
                      <option value="1">Logout</option>
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
                      filename    = "List project"
                      sheet       = "Sheet 1"
                      buttonText  = "Export to excel"
                      table       = "listPolicies" />
                  </div>
                </div>
                <div className="col-md-5 pull-right">
                  {/* <input ref={ e => this._taskSearch = e } onChange={ this.taskSearchChange } className="form-control" placeholder="Enter keywork" /> */}
                </div>
              </div>
              <div className="clear"></div>
              <hr style={{marginTop: '10px'}}/>
              <div className="table-responsive">
                <table id="listPolicies" className="table table-hover manage-u-table">
                  <thead>
                    <tr>
                      <th width="50px" className="text-center">STT</th>
                      <th>User</th>
                      <th className="text-center" width="200px">Action</th>
                      <th className="text-center" width="200px">Time</th>
                    </tr>
                  </thead>
                  <Item
                    data     = { data }
                    users    = { users.data }
                    ordered  = { orderTask } />
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
  let { login } = report;
  return { profile, login, users };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions     : bindActionCreators(breadcrumbActions, dispatch),
    loginActions          : bindActionCreators(loginActions, dispatch),
    userActions           : bindActionCreators(userActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(Home));