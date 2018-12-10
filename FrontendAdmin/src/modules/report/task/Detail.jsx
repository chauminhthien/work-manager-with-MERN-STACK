import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Scrollbars } from 'react-custom-scrollbars';

import { withNotification } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import { actions as userActions } from 'modules/user';
import { actions as taskActions } from 'modules/report/task';
import { actions as commentActions } from 'modules/categories/comment';

import { convertDMY } from 'utils/format';
import { isEmpty } from 'utils/functions';
import ItemFile from './ItemFile';
import ListCMT from './ListCMT';

class Detail extends Component {

  componentDidMount(){
    let { breadcrumbActions, profile, taskActions, userActions, commentActions, match } = this.props;
    let where = { groupUserID: profile.info.groupUserID };

    taskActions.fetchAll({}, 0, 0, where);
    userActions.fetchAll({}, 0, 0, where);

    breadcrumbActions.set({
      page_name: 'Report task',
      breadcrumb: [{name: "Report"}, {name: "Task", liClass: "active"}]
    });

    let { id } = match.params;
    commentActions.fetchAll({ order: "id DESC" }, 0, 0, {taskId: id, parentId  : "null"})
    
  }

  render() {
    let { task, match, users, comment, profile } = this.props;
    
    let { id } = match.params;
    let dataProject = task.data[id];
    
    if(!dataProject) return null;

    let now = Date.now();
    let process = {
      liClass : "success",
      text    : "Complete"
    }

    if(dataProject.process < 100){
      if(now >= dataProject.begin && now <= dataProject.end)
        process = { liClass : "info", text    : "Pending" };
      
      if(now > dataProject.end )
        process = { liClass : "danger", text: "Not complete" };

      if(now < dataProject.begin)
        process = { liClass : "default", text: "Not implemented yet" };
    }

    if(!!dataProject.finish) process = { liClass: "success", text: "Done" }

    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="white-box">
            <div>
              <h2 className="box-title m-b-0 m-t-0">Detail task</h2>
              <hr />
            </div>
            <div className="col-lg-5 col-md-5 col-sm-5">
              <h4 className="box-title ">{!!dataProject.name ? dataProject.name : ""}</h4>
              <div dangerouslySetInnerHTML={{__html: dataProject.description}}>

              </div>
              {
                !!dataProject.files && !isEmpty(dataProject.files) && (
                  <Fragment>
                    <h3 className="box-title ">File  </h3>
                    <ItemFile files = { dataProject.files } />
                  </Fragment>
                  
                )
              }
              
              <h2 className=" box-title ">Time: 
                <span className="m-l-15"> {convertDMY(dataProject.begin)} -> {convertDMY(dataProject.end)}</span>
              </h2>
              
              <h3 className="box-title ">Status 
                <span className={`m-l-15 label label-${process.liClass}`}>
                  {process.text}
                </span>
              </h3>
              <div className="clearfix"></div>
            </div>
            
            <div className="col-lg-7 col-md-7 col-sm-7">
              <Scrollbars style={{height: '500px'}}>
                <ListCMT
                  profile       = { profile }
                  friends       = { users }
                  dataTask      = { dataProject }
                  comment       = { comment } />
              </Scrollbars>
              
            </div>
            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>
        </div>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { profile, report, users } = state;
  let { comment } = state.categories;
  let { project, task } = report;
  return { profile, project, task, users, comment };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions    : bindActionCreators(breadcrumbActions, dispatch),
    taskActions          : bindActionCreators(taskActions, dispatch),
    userActions          : bindActionCreators(userActions, dispatch),
    commentActions       : bindActionCreators(commentActions, dispatch)
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(Detail));