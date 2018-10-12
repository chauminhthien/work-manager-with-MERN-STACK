import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import users                from 'assets/Images/user.jpg';

class Left extends Component {
  _inputAvata : null;

  avatrClick = () => {
    this._inputAvata.click()
  }

  uploadAvatar= () => {
   if(!!this.props.uploadFile && !!this._inputAvata.files[0])
    this.props.uploadFile(this._inputAvata.files[0]);
  }

  render() {
    let { profile } = this.props;

    let fullName = (profile && profile.info) ? `${profile.info.fullname}` : "";
    let email = (profile && profile.info) ? `${profile.info.email}` : "";

    let imgAvatar = profile && profile.info && profile.info.avatar ?  profile.info.avatar : users;
    return (
      <div className="col-md-4 col-xs-12 m-t-15">
        <div className="white-box">
          <div className="user-bg"> <img width="100%" alt="user" src={users}/>
            <div className="overlay-box">
              <div className="user-content">
                <Link onClick={ this.avatrClick } to="#">
                  <img src={imgAvatar} className="thumb-lg img-circle" alt="img" />
                </Link>
                <input onChange={ this.uploadAvatar } ref={e => this._inputAvata = e } type="file" style={{display: 'none'}} />
                <h4 className="text-white">{fullName}</h4>
                <h5 className="text-white">{email}</h5> </div>
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}

export default Left;