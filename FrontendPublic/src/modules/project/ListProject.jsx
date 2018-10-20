import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as projectActions from './actions';
import { Link } from 'react-router-dom';

class ListProject extends Component {
  
  componentDidMount(){
    let { profile, projectActions } = this.props;

    projectActions.fetchAll({

    },0, 0, {
      groupUserID: profile.info.groupUserID
    })

  }
  render() {
    let { project, location, profile } = this.props;
    let { ordered, data } = project;
    let pathname = !!location ? location.pathname : "";
    
    return (
      <div className="white-box">
        <h3 className="box-title m-b-0">
          <i className="fa fa-briefcase m-r-5"></i>
            Project
          <span className="clearfix"></span>
        </h3>
        <Scrollbars className="hiddenOverX" style={{ height: "85vh" }}>
          <div> 
            <Link to="/project/add" className="btn btn-custom btn-block waves-effect waves-light">Create new</Link>
            <div className="list-group mail-list m-t-20">
              {
                'push' in ordered && ordered.map((e, i) => {
                  if(!data[e]) return null;
                  let fl = false;
                  for(let v of data[e].memberJoins){
                    if(v.value === profile.info.id){
                      fl = true;
                      break;
                    }
                  }
                  if(profile.info.id !== data[e].createAt && !fl) return null;

                  return(
                    <Link key={i} to={`/project/view/${e}`} className={`list-group-item ${new RegExp(`.*/${e}$`).test(pathname)? 'active': ''}`}>
                      {data[e] ? data[e].name : ""}
                    </Link>
                  )
                })
              }
            </div>
          </div>
        </Scrollbars>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { profile, project } = state;

  return { profile, project };
};

let mapDispatchToProps = (dispatch) => {
  return {
    projectActions       : bindActionCreators(projectActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListProject);