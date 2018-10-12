import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import users        from 'assets/Images/user.jpg';

import{ isEmpty } from 'utils/functions';

class ListMember extends Component {

  friendClick = (e) => () => {
    if(!!this.props.friendClick) this.props.friendClick(e)
  }
  render() {

    let { friends } = this.props;
    if(!friends || isEmpty(friends.data) || isEmpty(friends.ordered)) return null;

    let { ordered, data } = friends;
    
    return (
      <ul className="chatonline">
        {
          ordered.map((e, i) => {
            let imgAvatar = data[e]  && data[e].avatar ?  data[e].avatar : users;
            return (
              <li key={i}>
                <Link onClick={ this.friendClick(e) } to="#">
                  <img src={imgAvatar} alt="user-img" className="img-circle" /> 
                  <span>
                    {data[e] ? data[e].fullname : ""} 
                    <small className={`text-${ !!data[e].online ? 'success' : 'muted' }`}>
                      { !!data[e].online ? 'Online' : 'Offline' }
                    </small>
                  </span>
                </Link>
              </li>
            )
          })
        }
      </ul>
    );
  }
}

export default ListMember;