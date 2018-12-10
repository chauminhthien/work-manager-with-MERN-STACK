import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Bar } from 'react-chartjs-2';

import { withNotification } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import * as projectActions from './actions';
import { actions as userActions } from 'modules/user';
import { actions as taskActions } from 'modules/report/task';

import { convertDMY } from 'utils/format';
import { isEmpty } from 'utils/functions';
import ItemFile from './ItemFile';
import ItemTask from './ItemTask';

class Detail extends Component {

  constructor(p){
    super(p);
    this.state = {
      chart : {
        labels: ['Task chart'],
        datasets: [
          {
            label: 'Complete',
            backgroundColor: 'rgba(83, 230, 157, 0.2)',
            borderColor: 'rgba(83, 230, 157, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(83, 230, 157, 0.4)',
            hoverBorderColor: 'rgba(83, 230, 157, 1)',
            data: [1]
          },
          {
            label: 'Pending',
            backgroundColor: 'rgba(44, 171, 227, 0.2)',
            borderColor: 'rgba(44, 171, 227, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(44, 171, 227, 0.4)',
            hoverBorderColor: 'rgba(44, 171, 227, 1)',
            data: [2]
          },
          {
            label: 'Not complete',
            backgroundColor: 'rgba(255, 118, 118, 0.2)',
            borderColor: 'rgba(255, 118, 118, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255, 118, 118, 0.4)',
            hoverBorderColor: 'rgba(255, 118, 118, 1)',
            data: [1]
          },
          {
            label: 'Not implemented yet',
            backgroundColor: 'rgba(112, 124, 210, 0.2)',
            borderColor: 'rgba(112, 124, 210, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(112, 124, 210, 0.4)',
            hoverBorderColor: 'rgba(112, 124, 210, 1)',
            data: [5]
          }
        ]
      }
    }
  }

  componentDidMount(){
    let { breadcrumbActions, profile, projectActions, taskActions, userActions, match } = this.props;
    let where = { groupUserID: profile.info.groupUserID };
    let { id } = match.params;

    projectActions.fetchAll({}, 0, 0, where);
    taskActions.fetchAll({}, 0, 0, where);
    userActions.fetchAll({}, 0, 0, where);
    projectActions.getChart(id)
      .then(r => {
        if(!!r){
          let { chart } = this.state;

          for(let v of r){
            chart.datasets[v.key].data = v.data;
          }
          this.setState({chart})
        }
      });

    breadcrumbActions.set({
      page_name: 'Report project',
      breadcrumb: [{name: "Report"}, {name: "Project", liClass: "active"}]
    });
    
  }

  render() {
    let { project, task, match, users } = this.props;
    
    let { id } = match.params;
    let dataProject = project.data[id];

    if(!dataProject) return null;

    let now = Date.now();
    let process = {
      liClass : "success",
      text    : "Complete"
    }

    if(dataProject.process < 100){
      if(now >= dataProject.begin && now <= dataProject.end)
        process = { liClass : "info", text    : "Pending" };
      
      if(now > dataProject.end )
        process = { liClass : "danger", text: "Not complete" };

      if(now < dataProject.begin)
        process = { liClass : "default", text: "Not implemented yet" };
    }

    if(!!dataProject.finish) process = { liClass : "success", text    : "Done" }

    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="white-box">
            <div>
              <h2 className="box-title m-b-0 m-t-0">Detail project</h2>
              <hr />
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6">
                  <h4 className="box-title ">{!!dataProject.name ? dataProject.name : ""}</h4>
                  <div dangerouslySetInnerHTML={{__html: dataProject.description}}>

                  </div>
                  {
                    !!dataProject.files && !isEmpty(dataProject.files) && (
                      <Fragment>
                        <h3 className="box-title ">File  </h3>
                        <ItemFile files = { dataProject.files } />
                      </Fragment>
                      
                    )
                  }
                  
                  <h2 className=" box-title ">Time: 
                    <span className="m-l-15"> {convertDMY(dataProject.begin)} -> {convertDMY(dataProject.end)}</span>
                  </h2>
                  
                  <h3 className="box-title ">Status 
                    <span className={`m-l-15 label label-${process.liClass}`}>
                      {process.text}
                    </span>
                  </h3>
           
                </div>
                
                <div className="col-lg-6 col-md-6 col-sm-6">

                  <Bar
                    data={this.state.chart}
                    width={100}
                    height={300}
                    options={{ maintainAspectRatio: false }} />
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <h3 className="box-title m-t-40">List Task</h3>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th width="50px" className="text-center">STT</th>
                          <th>Name task</th>
                          <th className="text-center" width="100px">Member Join</th>
                          <th className="text-center" width="200px">Begin day</th>
                          <th className="text-center" width="200px">End day</th>
                          <th className="text-center" width="100px">Status</th>
                          <th className="text-center" width="100px">Action</th>
                        </tr>
                      </thead>
                      <ItemTask
                        data              = { task.data }
                        users             = { users }
                        dataProject       = { dataProject }
                        ordered           = { task.ordered }/>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    breadcrumbActions    : bindActionCreators(breadcrumbActions, dispatch),
    projectActions       : bindActionCreators(projectActions, dispatch),
    taskActions          : bindActionCreators(taskActions, dispatch),
    userActions       : bindActionCreators(userActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(Detail));