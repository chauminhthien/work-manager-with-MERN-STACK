import React, { Component } from 'react';

import users        from 'assets/Images/user.jpg';

class TaskInfoRight extends Component {

  render() {
    
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
              <img src={users} alt="user-img" className="img-circle" />
              <span>User 01</span>
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
              <img src={users} alt="user-img" className="img-circle" />
              <span>User 01</span>
            </li>
          </ul>
          <span className="clearfix"></span>
        </div>

        <span className="clearfix"></span>
      </div>

    );
  }
}


export default TaskInfoRight;