import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { withNotification, AlertConfirm } from 'components';
import img_wellcome from 'assets/Images/img-wellcome.png';
import ItemFile from './ItemFile';
import * as projectActions from './actions';
import { actions as taskActions } from 'modules/task';
import { actions as cateTaskActions } from 'modules/categories/cateTask';
import users        from 'assets/Images/user.jpg';
import { isEmpty, rmv } from 'utils/functions';
import { convertMDY } from 'utils/format';

class ViewProject extends Component {

  _nameTaskSearch = null;

  constructor(props){
    super(props);
    this.state = {
      isWoring    : false,
      taskSearch  : null,
      idDonePro   : null
    }
  }

  componentDidMount(){
    let { profile, task, cateTask,  project, projectActions, taskActions, cateTaskActions } = this.props;

    if(project.ordered.length === 0) projectActions.fetchAll({},0, 0, { groupUserID: profile.info.groupUserID })

    if(task.ordered.length === 0) taskActions.fetchAll({
      order: "id DESC"
    },0 , 15, { groupUserID: profile.info.groupUserID })

    if(cateTask.ordered.length === 0) cateTaskActions.fetchAll({},0 , 15, { groupUserID: profile.info.groupUserID })
  }

  taskSearchChange = () => {
    let taskSearch  = !!this._nameTaskSearch ? this._nameTaskSearch.value : "";
    taskSearch      = rmv(taskSearch.trim());
  
    this.setState({taskSearch});
  }

  doneProject = (id) => (e) => {
    e.preventDefault();
    this.setState({idDonePro: id})
  }

  doneProjectSuccess = () => {
    let { idDonePro } = this.state;
    let { notification, projectActions} = this.props;

    projectActions.updateById(idDonePro, {finish: 1, timeFisnish: Date.now()})
      .then(r => {
        if(!!r.data) notification.s("Message", "Update done success");
      })
      .finally(() => this.setState({idDonePro: null}))
  }

  render() {
    let { project, task, match, friends, profile, cateTask } = this.props;
    let { isWoring, taskSearch, idDonePro } = this.state;

    let { id } = match.params;

    let dataProject = project.data[id];
    if(!dataProject) return null;

    let fl = false;
    for(let v of dataProject.memberJoins){
      if(v.value === profile.info.id){
        fl = true;
        break;
      }
    }

    let orderTask = [];
    let len = 0;
    let lenDone = 0;

    task.ordered.forEach(e => {
      let nameTask = !!task.data[e] ? task.data[e].name : "";
      nameTask = rmv(nameTask);
      if(taskSearch == null || nameTask.indexOf(taskSearch) !== -1) orderTask.push(e);

      if(task.data[e].projectId === id){
        ++len;
        if(!!task.data[e].finish) ++lenDone;
      }
    });
    
    if(profile.info.id !== dataProject.createAt && !fl) return null;
    return (
      <div className="white-box">
        {
          !!idDonePro
          ?
          ( 
            <AlertConfirm
              onCancel= { () => this.setState({idDonePro: null})}
              onSuccess= { this.doneProjectSuccess }
              title="Are you sure!"/>
          )
          : null
        }
        <div className="col-xs-3">
          <img alt="img" src={img_wellcome} />
        </div>
        <div className="col-xs-9 m-t-30">
          <div className="pull-right">
          
            {
              !!profile && !!profile.info.account_type && profile.info.account_type === 1 && !dataProject.finish &&
              (
                <Fragment>
                  <Link to={`/task/new/${id ? id : ""}`} className="btn btn-info btn-flat">Create new task</Link>
                  
                  {
                    lenDone*1.0 / len*1.0 >= 0.5 &&
                      <Link to="#" onClick={ this.doneProject(id) } className="btn m-l-15 btn-info btn-flat">Done project</Link>
                  }
                  
                  <Link to={`/project/edit/${id ? id : ""}`} className="m-l-15 btn btn-info btn-flat">Edit</Link>
                </Fragment>
              )
            }
            
          </div>
          
          <h2 className="box-title">{dataProject.name}<smail> ({convertMDY(dataProject.begin)} -> {convertMDY(dataProject.end)})</smail></h2>
          <div id="memberJoin">
            {
              'push' in dataProject.memberJoins && dataProject.memberJoins.length > 0 &&
              dataProject.memberJoins.map((e, i) => {
                let img = !!friends.data[e.value] && !!friends.data[e.value].avatar ? friends.data[e.value].avatar : users;
                return(
                  <img key={i} src={img} alt={friends.data[e.value] ? friends.data[e.value].fullname : ""} />
                )
              })
            }
          </div>
        </div>
        <div className="clear"></div>
          {
            dataProject.description && dataProject.description !== "" && (<div style={{padding: '15px'}} className="fileResult" dangerouslySetInnerHTML={{__html: dataProject.description}}></div>)
          }
        
        <ItemFile files = { dataProject.files } />
        <div className="clear"></div>
        <hr />

        <form className="form-horizontal m-t-15">
          <div className="form-group">
            <div className="col-sm-12">
              <input 
                ref         = { e => this._nameTaskSearch = e}
                onChange    = { this.taskSearchChange }
                type        = "text"
                className   = "form-control"
                placeholder = "Enter keywork" />

            </div>
          </div>
        </form>

        <Scrollbars className={`hiddenOverX ${!!isWoring ? 'loading' : ''}`} style={{height: '40vh'}}>
          <ul className="list-group no-br">
            <li className="list-group-item no-br br-b m-b-5 min-h-50">
              Chủ nhật (23/09/2018)
            </li>
            {
              !!task && !isEmpty(orderTask) && orderTask.map( (e, i) => {
                let taskItem = !!task.data && !!task.data[e] ? task.data[e]  : null;
                let now = Date.now();
                if(!taskItem || taskItem.projectId !== id) return null;

                let icon = !!cateTask && !!cateTask.data[taskItem.cateTaskId] ? cateTask.data[taskItem.cateTaskId].icon : "";
                let link = `/task/view/${e}?project=${taskItem.projectId}`
                let process = {
                  liClass : "success",
                  text    : "Complete"
                }

                if(taskItem.process < 100){
                  if(now >= taskItem.begin && now <= taskItem.end)
                    process = { liClass : "info", text    : "Pending" };
                  
                  if(now > taskItem.end )
                    process = { liClass : "danger", text: "Not complete" };

                  if(now < taskItem.begin)
                    process = { liClass : "default", text: "Not implemented yet" };
                }

                if(!!taskItem.finish) process = { liClass : "success", text    : "Done" }
                

                let avatar = (
                  !!friends.data[taskItem.memberId] && friends.data[taskItem.memberId].avatar
                  ? friends.data[taskItem.memberId].avatar : users)

                return (
                  <li key={i} className="list-group-item no-br br-b m-b-5 min-h-50">
                    <Link to={link} >
                      <div className="col-xs-6 p-l-0">
                        <img width="20px" alt={'users'} className="circle m-r-5" src={avatar}/>
                        <i className={`${icon} m-r-5 text-${process.liClass}`}></i>
                        <span className={`text-${process.liClass}`}>{taskItem.name ? taskItem.name : ""}</span>
                      </div>
                      <div className="col-xs-6">
                        <div className="col-xs-7 m-t-7">
                          <div className="progress">
                            <div className={`progress-bar progress-bar-${process.liClass}`} style={{width: `${taskItem.process ? taskItem.process : 0}%`}} role="progressbar">
                              <span className="sr-only">{taskItem.process ? taskItem.process : 0}% Complete</span> 
                            </div>
                          </div>
                        </div>
                        <div className={`col-xs-5 text-${process.liClass}`}>
                          ({process.text})
                        </div>
                      </div>
                      <div className="clear"></div>
                    </Link>
                  </li>
                )
              })
            }
          </ul>
        </Scrollbars>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { profile, project, task } = state;
  let { friends, cateTask }      = state.categories;
  return { profile, project, friends, task, cateTask };
};

let mapDispatchToProps = (dispatch) => {
  return {
    projectActions       : bindActionCreators(projectActions, dispatch),
    taskActions          : bindActionCreators(taskActions, dispatch),
    cateTaskActions      : bindActionCreators(cateTaskActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(ViewProject));