import React, { Component } from 'react';

class HomeTop extends Component {

  render() {
    let { users, project, task } = this.props;

    return (
      <div className="row">
        <div className="col-lg-3 col-sm-6 col-xs-12">
          <div className="white-box">
            <h3 className="box-title">Users</h3>
            <ul className="list-inline two-part">
              <li><i className="fa fa-user text-primary"></i></li>
              <li className="text-right"><span className="counter">{users ? users : 0}</span></li>
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-xs-12">
          <div className="white-box">
            <h3 className="box-title">Project</h3>
            <ul className="list-inline two-part">
              <li><i className="fa fa-send-o text-purple"></i></li>
              <li className="text-right"><span className="counter">{project ? project : 0}</span></li>
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-xs-12">
          <div className="white-box">
            <h3 className="box-title">Task</h3>
            <ul className="list-inline two-part">
              <li><i className="fa fa-check text-success"></i></li>
              <li className="text-right"><span className="">{!!task ? task.ordered.length : 0}</span></li>
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-xs-12">
          <div className="white-box">
            <h3 className="box-title">Task Complete</h3>
            <ul className="list-inline two-part">
              <li><i className="fa fa-check text-danger"></i></li>
              <li className="text-right"><span className="">
                {
                  Object.values(task.data).filter(e => !!e.finish).length
                }
              </span></li>
            </ul>
          </div>
        </div>
      </div>

    );
  }
}

export default HomeTop;