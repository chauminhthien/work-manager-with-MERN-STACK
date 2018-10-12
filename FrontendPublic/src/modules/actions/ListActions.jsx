import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link } from 'react-router-dom';

import users        from 'assets/Images/user.jpg';

class ListActions extends Component {

  render() {
    return (
      <div className="white-box">
        <h3 className="box-title m-b-0 fs-14 br-b">
          <i className="mdi mdi-apps m-r-5"></i>
            Actions
          <span className="clearfix"></span>
        </h3>
        <Scrollbars className="hiddenOverX" style={{ height: "75vh" }}>
          <ul className="list-group no-br list-action">

            {
              [...Array(20)].map((e, i) => {
                return (
                  <li key={i} className="list-group-item no-br p-l-0">
                    <Link to="/">
                      <img alt={'users'} width="20px" className="circle m-r-5" src={users}/>
                      <strong>Demo Kinh Doanh </strong>
                      đã cảm thấy <strong> Bực mình </strong> 
                      trong công việc <strong> THIET KE </strong> (2018-09-25 12:20:37)
                    </Link>
                  </li>
                )
              })
            }
          </ul>
        </Scrollbars>
      </div>
    );
  }
}


export default ListActions;