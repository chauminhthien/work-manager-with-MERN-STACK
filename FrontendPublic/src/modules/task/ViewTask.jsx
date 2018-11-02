import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';


import { withNotification } from 'components';
import img_wellcome from 'assets/Images/img-wellcome.png';
import ItemFile from './ItemFile';

import { actions as projectActions } from 'modules/project';
import * as taskActions from './actions';
import { actions as cateTaskActions } from 'modules/categories/cateTask';
import { actions as commentActions } from 'modules/categories/comment';

import FormCMT from './FormCMT';
import ListCMT from './ListCMT';

class ViewTask extends Component {
  constructor(props){
    super(props);
    this.state = {
      isWoring : false
    }
  }

  componentDidMount(){

    let { profile, project, task, cateTask, projectActions, comment, commentActions, match } = this.props;
    let { id } = match.params;

    if(project.ordered.length === 0){
      projectActions.fetchAll({
      },0, 0, {
        groupUserID: profile.info.groupUserID
      })
    }
    
    if(task.ordered.length === 0) taskActions.fetchAll({
      order: "id DESC"
    },0 ,15, { groupUserID: profile.info.groupUserID })

    if(cateTask.ordered.length === 0) cateTaskActions.fetchAll({},0 , 15, { groupUserID: profile.info.groupUserID });

    if(!comment.data[id]){
      commentActions.fetchAll({
        order: "id DESC"
      }, 0, 15, {
        taskId    : id,
        parentId  : "null"
      })
    }
    
  }

  commentSubmit = (data) => {
    
    let { commentActions, profile, match, notification } = this.props;
    let { id } = match.params;

    data.taskId = id;
    data.groupUserID = profile.info.groupUserID;
    data.userId = profile.info.id;

    return commentActions.create(data)
      .then(r => {
        if(!!r.error) return r.error;
        return true
      })
      .catch(e => {
        notification.e("Error", e.toString());
        return false;
      })
  }

  render() {
    let { match, profile, task, friends, comment } = this.props;
    let { isWoring } = this.state;

    let { id } = match.params;
    
    let dataTask = task.data[id];
    if(!dataTask || (profile.info.id !== dataTask.createAt && profile.info.id !== dataTask.memberId)) return null;
    
    let now = Date.now();
    let process = {
      liClass : "success",
      text    : "Complete"
    }

    if(dataTask.process < 100){
      if(now >= dataTask.begin && now <= dataTask.end)
        process = { liClass : "info", text    : "Pending" };
      
      if(now > dataTask.end )
        process = { liClass : "danger", text: "Not complete" };

      if(now < dataTask.begin)
        process = { liClass : "default", text: "Not implemented yet" };
    }

    return (
      <div className="white-box">
       
        <Scrollbars className={`hiddenOverX ${!!isWoring ? 'loading' : ''}`} style={{height: '85vh'}}>
          <div className="col-xs-3">
            <img alt="img" src={img_wellcome} />
          </div>
          <div className="col-xs-9 m-t-30">
            <div className="pull-right">
              {
                profile.info.id === dataTask.createAt &&  dataTask.process < 100 &&
                (
                  <Link to={`/task/edit/${id ? id : ""}?project=${dataTask ? dataTask.projectId: ""}`} className="m-l-15 btn btn-info btn-flat">Edit</Link>
                )
              }
              
            </div>
            
            <h2 className="box-title">{dataTask.name}</h2>

          </div>
          <div className="clear"></div>
          <h3 className="box-title m-b-0"><i className="ti-pencil m-r-5">
            </i>Description<span className="clearfix"></span>
          </h3>
          {
            dataTask.description && dataTask.description !== "" && (<div style={{padding: '15px'}} className="fileResult" dangerouslySetInnerHTML={{__html: dataTask.description}}></div>)
          }
          
          <ItemFile files = { dataTask.files } />
          <div className="clear"></div>

          <form className="form-horizontal m-t-15">
            <div className="form-group">
              <div className="col-sm-6">
                {
                  profile.info.id === dataTask.memberId && dataTask.status === 0 && (
                    <Fragment>
                      <Link className="btn btn-flat cbtn btn-outline btn-1e btn-danger m-r-5" to="/">Cancel</Link>
                      <Link className="btn btn-flat cbtn btn-outline btn-1e btn-success m-r-5" to="/">Confirm</Link>
                    </Fragment>
                  )
                }
                <Link className="btn btn-flat cbtn btn-outline btn-1e btn-info" to="/">Update work progress</Link>
              </div>
              <div className="col-sm-6">
                <h5>{process.text}<span className="pull-right">{dataTask.process}%</span></h5>
                <div className="progress">
                  <div className={`progress-bar progress-bar-${process.liClass}`} style={{width: `${dataTask.process}%`}} role="progressbar">
                    <span className="sr-only">60% Complete</span> 
                  </div>
                </div>
              </div>
            </div>
          </form>

          <FormCMT
            profile       = { profile }
            friends       = { friends }
            commentSubmit = { this.commentSubmit }
            dataTask      = { dataTask }/>

          <hr />

          <ListCMT
            profile       = { profile }
            friends       = { friends }
            comment       = { comment } />
        </Scrollbars>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { profile, project, task } = state;
  let { friends, cateTask, comment }           = state.categories
  return { profile, project, friends, cateTask, task, comment };
};

let mapDispatchToProps = (dispatch) => {
  return {
    projectActions       : bindActionCreators(projectActions, dispatch),
    taskActions          : bindActionCreators(taskActions, dispatch),
    cateTaskActions      : bindActionCreators(cateTaskActions, dispatch),
    commentActions       : bindActionCreators(commentActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(ViewTask));