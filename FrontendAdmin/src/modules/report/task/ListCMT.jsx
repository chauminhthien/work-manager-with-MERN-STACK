import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import users        from 'assets/Images/user.jpg';

import { isEmpty } from 'utils/functions';
import Files from './Files';
import { convertTimeMess } from 'utils/format';

class ListCMT extends Component {

  render() {

    let { profile, friends, comment } = this.props;
    let { data, ordered } = comment;
    
    return (
      <div style={{paddingBottom: "200px"}}>

        {
          !!ordered && 'push' in ordered && !isEmpty(ordered) && ordered.map( (e, i) =>{
            let cmt = data[e];
            if(!cmt || cmt.parentId !== "null") return null;

            let name = (cmt.userId === profile.info.id) 
              ? (profile.info.fullname) 
              : (!!friends.data[cmt.userId] ? friends.data[cmt.userId].fullname : "");

            let avatar = (cmt.userId === profile.info.id) 
              ? (profile.info.avatar) 
              : (!!friends.data[cmt.userId] && !!friends.data[cmt.userId].avatar ? friends.data[cmt.userId].avatar : users);
            
            let children = !!cmt.children && 'push' in cmt.children && !isEmpty(cmt.children) ? cmt.children : null;

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
                  {
                    !!cmt.userTags && cmt.userTags.map(e => {
                      return (
                        <Link key={e.value} className="m-r-15 pull-left" to="#" >{!!e && e.label}</Link>
                      )
                    })
                  }
                  
                  {
                    
                    !!cmt.files && !isEmpty(cmt.files)
                    ? <Files file = {cmt.files} />
                    : (
                      <div style={{width: "100%", wordBreak: "break-word", padding: "1px 10px 1px 0", borderRadius: "5px"}} dangerouslySetInnerHTML={{__html: cmt.content}} />
                    )
                  }
                  
                  <span className="m-l-15 label label-info label-rounded">{ !!cmt.time && convertTimeMess(cmt.time) }</span>

                  {
                    !!children && children.map((e) => {
                      let avt = (e.userId === profile.info.id) 
                        ? (profile.info.avatar) 
                        : (!!friends.data[e.userId] && !!friends.data[e.userId].avatar ? friends.data[e.userId].avatar : users);
                      
                      let name = (e.userId === profile.info.id) 
                        ? (profile.info.fullname) 
                        : (!!friends.data[e.userId] ? friends.data[e.userId].fullname : "");
                      return (
                        <div key={e.id} className="media">
                          <div className="media-left">
                            <Link to="#">
                              <img alt="64x64" className="media-object img-circle" src={avt} data-holder-rendered="true" style={{width: 35, height: 35}} />
                            </Link>
                          </div>
                          <div className="media-body">
                            <h4 className="media-heading">{name}</h4>
                            {
                              !!e.userTags && e.userTags.map(it => {
                                return (
                                  <Link key={it.value} className="m-r-15 pull-left" to="#" >{!!it && it.label}</Link>
                                )
                              })
                            }
                            {
                    
                              !!e.files && !isEmpty(e.files)
                              ? <Files file = {e.files} />
                              : (
                                <div style={{width: "100%", wordBreak: "break-word", padding: "1px 10px", borderRadius: "5px"}} dangerouslySetInnerHTML={{__html: e.content}} />
                              )
                            }
                            <span className="m-l-15 label label-info label-rounded">{ !!e.time && convertTimeMess(e.time) }</span>
                          </div>
                        </div>
                      )
                    })
                  }

                  
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