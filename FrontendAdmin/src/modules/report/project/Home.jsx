import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactToExcel from 'react-html-table-to-excel';

import Item from './Item';
import { withNotification } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import * as projectActions from './actions';
import { actions as taskActions} from 'modules/report/task';
import { rmv } from 'utils/functions';

class Home extends Component {
  _statusProject  = null;
  _taskSearch     = null;

  constructor(props){
    super(props);
    this.state = {
      taskSearch    : null,
      statusProject : ""
    }
  }
  
  componentDidMount(){
    let { breadcrumbActions, profile, projectActions, taskActions } = this.props;
    let where = { groupUserID: profile.info.groupUserID };


    projectActions.fetchAll({}, 0, 0, where)
    taskActions.fetchAll({}, 0, 0, where)

    breadcrumbActions.set({
      page_name: 'Report project',
      breadcrumb: [{name: "Report"}, {name: "Project", liClass: "active"}]
    });
    
  }

  checkJobStatus = (obj) => {
    let { statusProject, data } = obj;

    switch(statusProject){
      case "ALL":  return true;
      case "PENDING": return !data.finish;
      case "DONE": return !!data.finish;
      default: return true;
    }
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
    let { project, task } = this.props;
    let { data, ordered } = project;
    let { taskSearch, statusProject } = this.state;
    let orderTask = [];

    ordered.forEach(e => {
      let nameProject = !!data[e] ? data[e].name : "";
      nameProject     = rmv(nameProject);
      
      let flag = (taskSearch == null || nameProject.indexOf(taskSearch) !== -1);
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
                      <option value="DONE">Done</option>
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
                      <th>Name project</th>
                      <th className="text-center" width="200px">Begin day</th>
                      <th className="text-center" width="200px">End day</th>
                      <th className="text-center" width="100px">Status</th>
                      <th className="text-center" width="100px">Sum task</th>
                      <th width="100px" className="text-center">Action</th>
                    </tr>
                  </thead>
                  <Item
                    data     = { data }
                    task     = { task }   
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
  let { profile, report } = state;
  let { project, task } = report;
  return { profile, project, task };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions    : bindActionCreators(breadcrumbActions, dispatch),
    projectActions       : bindActionCreators(projectActions, dispatch),
    taskActions       : bindActionCreators(taskActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(Home));