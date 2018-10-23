import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link } from 'react-router-dom';

import users        from 'assets/Images/user.jpg';

class ListTask extends Component {

  render() {
    return (
      <div className="bottom">
        <ul className="nav nav-tabs tabs customtab">
          <li className={`tab  active`}>
            <Link  to="#" data-toggle="tab"> <span className="visible-xs">
              <i className="fa fa-home" /></span> <span className="hidden-xs">All</span>
            </Link>
          </li>

          <li className={`tab`}>
            <Link  to="#" data-toggle="tab"> <span className="visible-xs">
              <i className="fa fa-home" /></span> <span className="hidden-xs">Work me</span>
            </Link>
          </li>

          <li className={`tab`}>
            <Link  to="#" data-toggle="tab"> <span className="visible-xs">
              <i className="fa fa-home" /></span> <span className="hidden-xs">New</span>
            </Link>
          </li>

          <li className={`tab`}>
            <Link  to="#" data-toggle="tab"> <span className="visible-xs">
              <i className="fa fa-home" /></span> <span className="hidden-xs">Slow</span>
            </Link>
          </li>
        </ul>

        <form className="form-horizontal m-t-15">
          <div className="form-group">
            <div className="col-sm-8">
              <input type="text" className="form-control" placeholder="Enter keywork" />
            </div>

            <div className="col-sm-4">
              <select className="form-control">
                <option >The job assign me</option>
                <option >The job I assign</option>
                <option >The job contact to me</option>
              </select>
            </div>
          </div>
        </form>

        <Scrollbars className="hiddenOverX" style={{ minHeight: "45vh" }}>
          <ul className="list-group no-br">
            <li className="list-group-item no-br br-b m-b-5 min-h-50">
              Chủ nhật (23/09/2018)
            </li>
            {[...Array(20)].map( (e, i) => {
              return (
                <li key={i} className="list-group-item no-br br-b m-b-5 min-h-50">
                  <Link to="#">
                    <div className="col-xs-6 p-l-0">
                      <img width="20px" alt={'users'} className="circle m-r-5" src={users}/>
                      <i className="fa fa-phone m-r-5 text-default"></i>
                      <span className="text-danger">Test tạo công việc -  {i}</span>
                    </div>
                    <div className="col-xs-6">
                      <div className="col-xs-7 m-t-7">
                        <div className="progress">
                          <div className="progress-bar progress-bar-danger" style={{width: '60%'}} role="progressbar">
                            <span className="sr-only">60% Complete</span> 
                          </div>
                        </div>
                      </div>
                      <div className="col-xs-5 text-default">
                        (Đang tiến hành)
                      </div>
                    </div>
                    <div className="clear"></div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </Scrollbars>
      </div>
    );
  }
}


export default ListTask;