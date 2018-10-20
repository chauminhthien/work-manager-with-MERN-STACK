import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { actions as messageActions } from 'modules/categories/messages';

import { ListProject } from 'modules/project';
import { ListActions } from 'modules/actions';

import img_wellcome from 'assets/Images/img-wellcome.png';
import users                from 'assets/Images/user.jpg';
import { convertTimeMess } from 'utils/format';

class Notification extends Component {

  componentDidMount(){
    let { messages, profile, messageActions } = this.props;
    if(messages.ordered.length === 0){
        messageActions.fetchAll({
            include: [
                {relation: "usersFrom", scope: { fields: { fullname: true, avatar: true }}},
                {relation: "userTo", scope: { fields: { fullname: true, avatar: true }}},
              ],
            order: "id DESC"
        },0 , 15, {
          groupUserID: profile.info.groupUserID,
          userIdTo: profile.info.id
        })
    }
  }

  onScrollFrame = (e) => {
    if( e.top === 1){
        let { messageActions, messages, profile } = this.props;
        let litmit = messages.ordered.length;
        messageActions.fetchMore({
            include: [
                {relation: "usersFrom", scope: { fields: { fullname: true, avatar: true }}},
                {relation: "userTo", scope: { fields: { fullname: true, avatar: true }}},
              ],
            order: "id DESC"
        },litmit , 15, {
          groupUserID: profile.info.groupUserID,
          userIdTo: profile.info.id
        })
    }
  }

  render() {
    let { messages } = this.props;

    return (
      <div className="row">
        <div id="projectList" className="col-xs-2 p-0 p-l-15">
          <ListProject />
        </div>

        <div className="col-xs-7 p-0 h-100 bd-r">
          <div className="white-box">
            <div className="col-xs-3">
              <img alt="img" src={img_wellcome} />
            </div>
            <div className="col-xs-9 m-t-30">
              <h2 className="box-title">ALL notification</h2>
              <p>Start assigning and completing the work of yourself and your colleagues.</p>
            </div>
            <div className="clear"></div>
            <hr />
            <ul className="notication">
          
              <Scrollbars  onScrollFrame ={ this.onScrollFrame } className={`hiddenOverX ${!!messages.isWoring ? 'loading': ''}`} style={{height: '60vh'}}>
                  {
                      !!messages.ordered && messages.ordered.length > 0 && messages.ordered.map((e, i) => {
                          let img = messages.data[e] &&  messages.data[e].usersFrom && messages.data[e].usersFrom.avatar ? messages.data[e].usersFrom.avatar : users;
                          let nameForm = messages.data[e] && messages.data[e].usersFrom && messages.data[e].usersFrom.fullname ? messages.data[e].usersFrom.fullname : "";
                          let link = messages.data[e] && messages.data[e].link ? `${messages.data[e].link}?noti=${e}` : '';
                          let txt = (
                              <span className="mail-desc">
                                  <strong style={{margin: '0 5px'}}>{nameForm}</strong> &#32;	
                                  {messages.data[e].nameAction ? messages.data[e].nameAction : ""} &#32;
                                  <strong style={{margin: '0 5px'}}>{messages.data[e].nameWork ? messages.data[e].nameWork : ""}</strong> 
                              </span> 
                              );
                          return (
                              <li key={i} className={`${!!messages.data[e].status ? "" : "active"}`}>
                                  <div className="message-center">
                                      <Link to={link}>
                                          <div className="user-img">
                                          <img src={img} alt="user" className="img-circle" /> 
                                          <span className="profile-status pull-right"></span>
                                          </div>
                                          <div className="mail-contnet">
                                              {txt}
                                              <span className="time">{messages.data[e].time ? convertTimeMess(messages.data[e].time) : ""}</span> </div>
                                      </Link>
                                  </div>
                              </li>
                          )
                      })
                  }
                  
              </Scrollbars>
          </ul>
          </div>
        </div>

        <div className="col-xs-3 p-0 p-r-15 h-100">
          <ListActions />
        </div>
      </div>
    );
  }
}


let mapStateToProps = (state) => {
  let { profile } = state;
  let { friends, messages } = state.categories;
  return { profile, friends, messages };
};

let mapDispatchToProps = (dispatch) => {
  return {
    messageActions    : bindActionCreators(messageActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);