import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions as logActions } from 'modules/categories/logs';
import { convertTimeMess } from 'utils/format';
import users        from 'assets/Images/user.jpg';

class ListActions extends Component {

  componentDidMount(){
    let { logs, profile, logActions } = this.props;
    let where = { groupUserID: profile.info.groupUserID };
    if(profile.info.account_type !== 1) where.userID = profile.info.id;
    
    if(logs.ordered.length === 0){
      logActions.fetchAll({
        include : [
          {relation: "users", scope: { fields: { fullname: true, avatar: true }}},
        ],
        order: "id DESC"
      }, 0, 15, where)
    }
  }

  render() {
    let { logs, profile } = this.props;
    let { isWoring, data, ordered } = logs;

    return (
      <div className="white-box">
        <h3 className="box-title m-b-0 fs-14 br-b">
          <i className="mdi mdi-apps m-r-5"></i>
            Actions
          <span className="clearfix"></span>
        </h3>
        <Scrollbars className={`hiddenOverX ${!!isWoring ? 'loading': ''}`} style={{ height: "75vh" }}>
          <ul className="list-group no-br list-action">

            {
              !!ordered && ordered.length > 0 && ordered.map((e, i) => {
                if(!data[e]) return null;
                let img = data[e].users && data[e].users.avatar ? data[e].users.avatar : users;
                let fullname = (profile.info.id === data[e].userID) ? "Bạn" : (data[e].users && data[e].users.fullname ? data[e].users.fullname : "");
                
                return (
                  <li key={i} className="list-group-item no-br p-l-0">
                    <Link to="/">
                      <img alt={'users'} width="20px" className="circle m-r-5" src={img}/>
                      <strong>{fullname} </strong>
                      { data[e].nameAction ? data[e].nameAction : "" }
                      <strong> { data[e].nameWork ? data[e].nameWork : "" } </strong>
                      {
                        data[e].nameTask && data[e].nameTask !== ""
                        ? (<span>trong công việc <strong> {data[e].nameWork} </strong></span>)
                        : null
                      }
                      {
                        data[e].time && convertTimeMess(data[e].time)
                      }
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


let mapStateToProps = (state) => {
  let { profile } = state;
  let { logs } = state.categories;

  return { profile, logs };
};

let mapDispatchToProps = (dispatch) => {
  return {
    logActions     : bindActionCreators(logActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListActions);