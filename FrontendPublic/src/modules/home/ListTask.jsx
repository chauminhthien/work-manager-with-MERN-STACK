import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link } from 'react-router-dom';

import users        from 'assets/Images/user.jpg';

class ListTask extends Component {
  _nameTaskSearch = null;
  _jobType        = null;

  render() {
    let { data, ordered, cateTask, friends, isEmpty, jobStatus, profile } = this.props;
    
    return (
      <div className="bottom">
        <ul className="nav nav-tabs tabs customtab">
          <li className={`tab  ${jobStatus === "ALL" ? "active" : ""}`}>
            <Link onClick={ this.props.jobStatusChange("ALL") } to="#" data-toggle="tab"> <span className="visible-xs">
              <i className="fa fa-home" /></span> <span className="hidden-xs">All</span>
            </Link>
          </li>

          <li className={`tab  ${jobStatus === "NEW" ? "active" : ""}`}>
            <Link onClick={ this.props.jobStatusChange("NEW") } to="#" data-toggle="tab"> <span className="visible-xs">
              <i className="fa fa-home" /></span> <span className="hidden-xs">New</span>
            </Link>
          </li>

          <li className={`tab  ${jobStatus === "SLOW" ? "active" : ""}`}>
            <Link onClick={ this.props.jobStatusChange("SLOW") } to="#" data-toggle="tab"> <span className="visible-xs">
              <i className="fa fa-home" /></span> <span className="hidden-xs">Slow</span>
            </Link>
          </li>

          <li className={`tab  ${jobStatus === "PENDING" ? "active" : ""}`}>
            <Link onClick={ this.props.jobStatusChange("PENDING") } to="#" data-toggle="tab"> <span className="visible-xs">
              <i className="fa fa-home" /></span> <span className="hidden-xs">Pending</span>
            </Link>
          </li>

          <li className={`tab  ${jobStatus === "COMPLETE" ? "active" : ""}`}>
            <Link onClick={ this.props.jobStatusChange("COMPLETE") } to="#" data-toggle="tab"> <span className="visible-xs">
              <i className="fa fa-home" /></span> <span className="hidden-xs">Complete</span>
            </Link>
          </li>

        </ul>

        <form className="form-horizontal m-t-15">
          <div className="form-group">
            <div className="col-sm-8">
              <input ref={ e => this._nameTaskSearch = e } onChange={ this.props.taskSearchChange(this._nameTaskSearch) } type="text" className="form-control" placeholder="Enter keywork" />
            </div>

            <div className="col-sm-4">
              <select ref={e => this._jobType = e} onChange={ this.props.jobTypeChane(this._jobType)} className="form-control">
                <option value="-1" >All job</option>
                <option value="0">The job assign me</option>
                <option value="1">The job I assign</option>
              </select>
            </div>
          </div>
        </form>

        <Scrollbars className="hiddenOverX" style={{ minHeight: "45vh" }}>
          <ul className="list-group no-br">
            {/* <li className="list-group-item no-br br-b m-b-5 min-h-50">
              Chủ nhật (23/09/2018)
            </li> */}
              {
                !!data && !isEmpty(ordered) && ordered.map( (e, i) => {
                  let taskItem = !!data && !!data[e] ? data[e]  : null;
                  let now = Date.now();
                 
                  if(!taskItem) return null;

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
                    ? friends.data[taskItem.memberId].avatar 
                    : ( taskItem.memberId === profile.info.id && !!profile.info.avatar ? profile.info.avatar : users))
                    
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


export default ListTask;