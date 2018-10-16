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
    let { project } = this.props;
    let { ordered, data } = project
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
                  return(
                    <Link key={i} to={`/task/list/${e}`} className="list-group-item">
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