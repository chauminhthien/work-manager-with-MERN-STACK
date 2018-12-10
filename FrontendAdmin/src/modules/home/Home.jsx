import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {Line} from 'react-chartjs-2';

import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import { actions as groupUserActions } from 'modules/groupUser';
import { actions as userActions } from 'modules/user';
import { actions as projectActions} from 'modules/report/project';
import { actions as taskActions} from 'modules/report/task';
import { actions as loginActions} from 'modules/report/login';

import HomeTopAdmin from './HomeTopAdmin';
import HomeTop from './HomeTop';

class DashBoard extends Component {

  constructor(p){
    super(p);
    this.state = {
      chart : {
        labels: [],
        datasets: [
          {
            label: 'Login',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: []
          }
        ]
      }
    }
  }

  componentDidMount(){
    let { breadcrumbActions, groupUserActions, profile, userActions,
      projectActions, taskActions, loginActions } = this.props;

    let where = !profile.info.account_type ? {} : { groupUserID: profile.info.groupUserID };

    groupUserActions.fetchAll();
    userActions.fetchAll({}, 0, 0, where);
    projectActions.fetchAll({}, 0, 0, where);
    taskActions.fetchAll({}, 0, 0, where);
    loginActions.getChart()
      .then(r => {
        if(!!r){
          let { labels, data } = r;
          let { chart } = this.state;

          chart.labels = labels;
          chart.datasets[0].data = data;

          this.setState({chart})
        }
      })

    breadcrumbActions.set({
      page_name: 'Dashboard'
    });

    
  }

  handelHomeTop = () => {
    let { profile, groupUser, users, project, task } = this.props;
    
    if(!profile.info.account_type)
      return <HomeTopAdmin
        users       = { users.ordered.length }
        task        = { task.ordered.length }
        project     = { project.ordered.length }
        groupUser   = { groupUser.ordered.length } />
    return <HomeTop
      project     = { project.ordered.length }
      task        = { task }
      users       = { users.ordered.length } />;
  }


  render() {
    console.log(this.state.chart);
    return (
      <div>
        { this.handelHomeTop() }
        
        <div className="white-box">
          <Line data={this.state.chart} height={300} options={{ maintainAspectRatio: false }} />
        </div>
        
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { profile, report, users, groupUser } = state;
  let { project, task, login } = report;

  return { profile, login, users, groupUser, project, task, };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions       : bindActionCreators(breadcrumbActions, dispatch),
    groupUserActions        : bindActionCreators(groupUserActions, dispatch),
    userActions             : bindActionCreators(userActions, dispatch),
    projectActions          : bindActionCreators(projectActions, dispatch),
    taskActions             : bindActionCreators(taskActions, dispatch),
    loginActions            : bindActionCreators(loginActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);