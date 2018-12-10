import React, { Component } from 'react';

class HomeTopAdmin extends Component {

  render() {
    let { groupUser, users, project, task } = this.props;

    return (
      <div className="row">
        <div className="col-lg-3 col-sm-6 col-xs-12">
          <div className="white-box">
            <h3 className="box-title">Group user</h3>
            <ul className="list-inline two-part">
              <li><i className="fa fa-users text-primary"></i></li>
              <li className="text-right"><span className="counter">{!!groupUser ? groupUser : 0}</span></li>
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-xs-12">
          <div className="white-box">
            <h3 className="box-title">Users</h3>
            <ul className="list-inline two-part">
              <li><i className="fa fa-user text-info"></i></li>
              <li className="text-right"><span className="counter">{users ? users : 0}</span></li>
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-xs-12">
          <div className="white-box">
            <h3 className="box-title">Project</h3>
            <ul className="list-inline two-part">
              <li><i className="fa fa-check text-success"></i></li>
              <li className="text-right"><span className="">{project ? project : 0}</span></li>
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-xs-12">
          <div className="white-box">
            <h3 className="box-title">Task</h3>
            <ul className="list-inline two-part">
              <li><i className="fa fa-frown-o text-danger"></i></li>
              <li className="text-right"><span className="">{!!task ? task : 0}</span></li>
            </ul>
          </div>
        </div>
      </div>

    );
  }
}

export default HomeTopAdmin;