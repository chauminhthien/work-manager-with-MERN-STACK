import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import users        from 'assets/Images/user.jpg';

import { isEmpty } from 'utils/functions';

class ListCMT extends Component {

  render() {

    let { profile, friends, comment } = this.props;
    let { data, ordered } = comment;
    return (
      <div style={{paddingBottom: "200px"}}>

        {
          !!ordered && 'push' in ordered && !isEmpty(ordered) && ordered.map( (e, i) =>{
            let cmt = data[e];
            if(!cmt) return null;

            let name = (cmt.userId === profile.info.id) 
              ? (profile.info.fullname) 
              : (!!friends.data[cmt.userId] ? friends.data[cmt.userId].fullname : "");

            let avatar = (cmt.userId === profile.info.id) 
              ? (profile.info.avatar) 
              : (!!friends.data[cmt.userId] && !!friends.data[cmt.userId].avatar ? friends.data[cmt.userId].avatar : users);

            return (
              <div key={e} className="media">
                <div className="media-left">
                  <Link to="#"> 
                    <img alt="64x64" className="media-object img-circle" src={avatar} data-holder-rendered="true" style={{width: 35, height: 35}} />
                  </Link>
                </div>
                <div className="media-body">
                  <h4 className="media-heading">
                    {name}
                  </h4> 
                  <div style={{width: "100%", wordBreak: "break-word", background: "#e5e5e5", padding: "1px 10px", borderRadius: "5px"}} dangerouslySetInnerHTML={{__html: cmt.content}} />
                  <div className="media">
                    <div className="media-left">
                      <Link to="#"> <img alt="64x64" className="media-object" src={users} data-holder-rendered="true" style={{width: 35, height: 35}} /> </Link>
                    </div>
                    <div className="media-body">
                      <h4 className="media-heading">Nested media heading</h4> Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus. </div>
                  </div>
                </div>
              </div>
            )

          })
        }
        
      </div>
    );
  }
}


export default ListCMT;