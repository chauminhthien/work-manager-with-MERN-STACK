import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Scrollbars } from 'react-custom-scrollbars';

import * as sessionActions from 'modules/session/actions';
import { actions as profileActions } from 'modules/account';

import admin_logo           from 'assets/plugins/images/admin-logo.png';
import admin_logo_dark      from 'assets/plugins/images/admin-logo-dark.png';
import admin_text           from 'assets/plugins/images/admin-text.png';
import admin_text_dark      from 'assets/plugins/images/admin-text-dark.png';
import users                from 'assets/Images/user.jpg';
import { convertTimeMess } from 'utils/format';
import { isEmpty } from 'utils/functions';

class Menu extends Component {

  constructor(props){
    super(props);
    this.state = {
      countMess : 0
    }
  }

  handelSignOut = (e) => {
    e.preventDefault();
    
    let { sessionActions, profileActions, session } = this.props;
    profileActions.signOut(session.token);
    sessionActions.resetSession()
  }

  componentDidMount(){
    
  }

  componentDidUpdate(){
    let { friends, chatting, profile } = this.props;
    let countMess = 0;

    if(friends.ordered.length > 0 && !isEmpty(chatting.data) && !!profile.info){
      let { ordered } = friends;

      for(let id of ordered){
        let len = !!chatting.data[id] ? chatting.data[id].length : 0;
        len > 0 && !chatting.data[id][len - 1].status && profile.info.id !== chatting.data[id][len - 1].idMe && ++countMess;
      }
      if(this.state.countMess !== countMess) this.setState({countMess})
    }
  }

  render() {
    let { countMess } = this.state;
    let { profile, friends, chatting } = this.props;
    let email = (profile.info) ? profile.info.email : "";
    let fullName = (profile.info) ? `${profile.info.fullname}` : "";
    let imgAvatar = profile && profile.info && profile.info.avatar ?  profile.info.avatar : users;

    let { ordered } = friends;

    return (
      <nav className="navbar navbar-default navbar-static-top m-b-0">
        <div className="navbar-header">
            <div className="top-left-part">
            
                <Link className="logo" to="/">
                <b>
                    <img src={admin_logo} alt="home" className="dark-logo" />
                    <img src={admin_logo_dark} alt="home" className="light-logo" />
                </b>
                    <span className="hidden-xs">
                    <img src={admin_text} alt="home" className="dark-logo" />
                    <img src={admin_text_dark} alt="home" className="light-logo" />
                </span>
                </Link>
            </div>
            
            <ul className="nav navbar-top-links navbar-left">
                <li><Link to="#" className="open-close waves-effect waves-light visible-xs"><i className="ti-close ti-menu"></i></Link></li>
                <li className="dropdown">
                    <Link className="dropdown-toggle waves-effect waves-light" data-toggle="dropdown" to="#"> <i className="mdi mdi-gmail"></i>
                        <div className="notify">
                        <span className="heartbit"></span> <span className="point"></span>
                        </div>
                    </Link>
                    <ul className="dropdown-menu mailbox animated bounceInDown">
                        <li>
                            <div className="drop-title">You have 4 new messages</div>
                        </li>
                        <li>
                            <div className="message-center">
                                <Link to="#">
                                    <div className="user-img">
                                    <img src={users} alt="user" className="img-circle" /> 
                                    <span className="profile-status online pull-right"></span>
                                    </div>
                                    <div className="mail-contnet">
                                        <h5>Pavan kumar</h5> <span className="mail-desc">Just see the my admin!</span> <span className="time">9:30 AM</span> </div>
                                </Link>
                            </div>
                        </li>
                        <li>
                            <Link className="text-center" to="#"> <strong>See all notifications</strong> <i className="fa fa-angle-right"></i> </Link>
                        </li>
                    </ul>
                </li>

                <li className="dropdown">
                    <Link className="dropdown-toggle waves-effect waves-light" data-toggle="dropdown" to="#"> 
                        <i className="fa fa-comment"></i>
                        <div className={` ${countMess > 0 ? 'notify' : ""}`}>
                        <span className="heartbit"></span> <span className="point"></span>
                        </div>
                    </Link>
                    <ul className="dropdown-menu mailbox animated bounceInDown">
                        <li>
                            <div className="drop-title">You have {countMess} new messages</div>
                        </li>
                            <Scrollbars className="hiddenOverX" style={{height: '40vh'}}>
                            {
                                !!ordered && 'push' in ordered && ordered.map((e, i) => {
                                    let img = friends.data[e] && friends.data[e].avatar ? friends.data[e].avatar : users;
                                    let len = !!chatting.data[e] ? chatting.data[e].length : 0;
                                    let mess = len > 0 ? chatting.data[e][len - 1].message : "No message";
                                    let time = len > 0 ? convertTimeMess(chatting.data[e][len - 1].time) : "";
                                    let ative = len > 0 && !chatting.data[e][len - 1].status && profile.info.id !== chatting.data[e][len - 1].idMe ? 'chat-active' : "";
                                    
                                    return (
                                        <li key={i} className={ative}>
                                            <div className="message-center">
                                                <Link to="#">
                                                    <div className="user-img">
                                                    <img src={img} alt="user" className="img-circle" /> 
                                                    <span className={`profile-status ${!!friends.data[e].online ? 'online' : 'off'} pull-right`}></span>
                                                    </div>
                                                    <div className="mail-contnet">
                                                        <h5>{friends.data[e] ? friends.data[e].fullname : ""}</h5>
                                                        <span className="mail-desc">{mess}</span>
                                                        <span className="time">{time}</span>
                                                    </div>
                                                </Link>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                            </Scrollbars>
                        <li>
                            <Link to="/messagse" className="text-center" >
                                <strong>See all messagse</strong> <i className="fa fa-angle-right"></i>
                            </Link>
                        </li>
                    </ul>
                </li>

            </ul>
            <ul className="nav navbar-top-links navbar-right pull-right">
                <li>
                    <form role="search" className="app-search hidden-sm hidden-xs m-r-10">
                        <input type="text" placeholder="Search..." className="form-control" /> <Link to=""><i className="fa fa-search"></i></Link> </form>
                </li>
                <li className="dropdown">
                    <Link className="dropdown-toggle profile-pic" data-toggle="dropdown" to="#">
                        <img src={imgAvatar} alt="user-img" width="36" className="img-circle autoImage-1" />
                        <b className="hidden-xs">{fullName}</b><span className="caret"></span> 
                    </Link>
                    <ul className="dropdown-menu dropdown-user animated flipInY">
                    
                        <li>
                            <div className="dw-user-box">
                                <div className="u-img">
                                    <img src={imgAvatar} alt="user-img" width="36" className="img-circle autoImage-1" />
                                </div>
                                <div className="u-text">
                                    <h4>{fullName}</h4>
                                    <p className="text-muted" style={{textOverflow: 'hidden'}}>{email}</p>
                                </div>
                            </div>
                        </li>
                        <li role="separator" className="divider"></li>
                        <li><Link  to="/profile"><i className="ti-user"></i> My Profile</Link></li>
                        <li><Link onClick={ this.handelSignOut} to="#"><i className="fa fa-power-off"></i> Logout</Link></li>
                    </ul>
                </li>
                
            </ul>
        </div>
    </nav>
    );
  }
}

let mapStateToProps = (state) => {
  let { profile, session, chatting } = state;
  let { friends } = state.categories;
  return { profile, session, chatting, friends };
};

let mapDispatchToProps = (dispatch) => {
  return {
    sessionActions    : bindActionCreators(sessionActions, dispatch),
    profileActions    : bindActionCreators(profileActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);