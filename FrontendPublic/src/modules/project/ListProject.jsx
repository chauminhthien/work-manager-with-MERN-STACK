import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import { Link } from 'react-router-dom';

class ListProject extends Component {

  render() {
    return (
      <div className="white-box">
        <h3 className="box-title m-b-0">
          <i className="fa fa-briefcase m-r-5"></i>
            Project
          <span className="clearfix"></span>
        </h3>
        <Scrollbars className="hiddenOverX" style={{ height: "85vh" }}>
          <div> 
            <Link to="/project/add" className="btn btn-custom btn-block waves-effect waves-light">Create new</Link>
            <div className="list-group mail-list m-t-20">
              <Link to="#" className="list-group-item active">
                Hướng Nghiệp
              </Link>
              <Link to="#" className="list-group-item ">
                Đồ án tốt nghiệp
              </Link>
              <Link to="#" className="list-group-item">
                CRM
                <span className="label label-rouded label-warning pull-right">
                  15
                </span>
              </Link>
              <Link to="#" className="list-group-item">
                Work manager
              </Link>
              <Link to="#" className="list-group-item">
                Trash
                <span className="label label-rouded label-default pull-right">
                  55
                </span>
              </Link>
    
            </div>
          </div>
        </Scrollbars>
      </div>
    );
  }
}


export default ListProject;