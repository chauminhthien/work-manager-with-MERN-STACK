import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import * as sessionActions from 'modules/session/actions';
import { actions as profileActions } from 'modules/account';

// import admin_logo           from 'assets/plugins/images/admin-logo.png';
import admin_logo           from 'assets/Images/logo.png';
// import admin_logo_dark      from 'assets/plugins/images/admin-logo-dark.png';
// import admin_text           from 'assets/plugins/images/admin-text.png';
// import admin_text_dark      from 'assets/plugins/images/admin-text-dark.png';
import users                from 'assets/Images/user.jpg';

class Menu extends Component {

    handelSignOut = (e) => {
      e.preventDefault();
      
      let { sessionActions, profileActions, session } = this.props;
      profileActions.signOut(session.token);
      sessionActions.resetSession()
    }

  render() {
    let { profile } = this.props;
    let email = (profile.info) ? profile.info.email : "";
    let fullName = (profile.info) ? `${profile.info.fullname}` : "";

    return (
      <nav className="navbar navbar-default navbar-static-top m-b-0">
        <div className="navbar-header">
            <div className="top-left-part">
            
                <Link className="logo" to="/">
                <b>
                    <img src={admin_logo} alt="home" style={{width: '45px'}} className="dark-logo img-responsive" />
                    <img src={admin_logo} alt="home" className="light-logo" />
                </b>
                  
                </Link>
            </div>
            
            <ul className="nav navbar-top-links navbar-right pull-right">
                <li>
                    <form role="search" className="app-search hidden-sm hidden-xs m-r-10">
                        <input type="text" placeholder="Search..." className="form-control" /> <Link to=""><i className="fa fa-search"></i></Link> </form>
                </li>
                <li className="dropdown">
                    <Link className="dropdown-toggle profile-pic" data-toggle="dropdown" to="#">
                        <img src={users} alt="user-img" width="36" className="img-circle autoImage-1" />
                        <b className="hidden-xs">{fullName}</b><span className="caret"></span> 
                    </Link>
                    <ul className="dropdown-menu dropdown-user animated flipInY">
                    
                        <li>
                            <div className="dw-user-box">
                                <div className="u-img">
                                    <img src={users} alt="user-img" width="36" className="img-circle autoImage-1" />
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
  let { profile, session } = state;
  return { profile, session };
};

let mapDispatchToProps = (dispatch) => {
  return {
    sessionActions    : bindActionCreators(sessionActions, dispatch),
    profileActions    : bindActionCreators(profileActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);