import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification } from 'components';

import img_wellcome from 'assets/Images/img-wellcome.png';
import ListTask from './ListTask';
import { Form as FormAddTask } from 'modules/task';

import { actions as cateTaskAction } from 'modules/categories/cateTask';
import { actions as projectActions } from 'modules/project';
import { actions as taskActions } from 'modules/task';

class CenterHome extends Component {
  _changNameNewTask = null;;

  constructor(props){
    super(props);
    this.state = {
      nameTask: null
    }
  }

  componentWillMount(){
    let { cateTask, task, profile, taskActions, cateTaskAction, projectActions, project } = this.props;
    
    if(cateTask.ordered.length === 0) cateTaskAction.fetchAll({}, 0, 0, {groupUserID: profile.info.groupUserID});
    if(task.ordered.length === 0) taskActions.fetchAll({
      order: "id DESC"
    },0 , 15, { groupUserID: profile.info.groupUserID })

    if(project.ordered.length === 0) projectActions.fetchAll({ },0, 0, { groupUserID: profile.info.groupUserID })
      
  }

  changNameNewTask = () => {
    let nameTask = !!this._changNameNewTask ? this._changNameNewTask.value : "";
    nameTask = nameTask.trim();
    
    if(nameTask.length >= 3){
      this.setState({nameTask})
    }else this.setState({nameTask: null})
  }

  render() {
    let { nameTask } = this.state;
    let { cateTask, project } = this.props;

    return (
      <div className="white-box">
        <div className="top">
          <div className="col-xs-3">
            <img alt="img" src={img_wellcome} />
          </div>
          <div className="col-xs-9 m-t-30">
            <h2 className="box-title">Manage your daily work</h2>
            <p>Start assigning and completing the work of yourself and your colleagues.</p>
          </div>
          
          <div className="clear"></div>

          <div className="col-xs-12 m-t-15 p-0">
            <form className="form-horizontal">
              <div className="form-group">
                <div className="col-sm-12">
                    {
                      !nameTask && (
                        <div className="input-group br-b">
                          <div className="input-group-addon no-bg no-br ">
                            <i style={{color: '#00c23f', fontSize: '18px' }} className="fa fa-plus" />
                          </div>
                          <input 
                                ref={e => this._changNameNewTask = e}
                                onChange={ this.changNameNewTask }
                                type="text" className="form-control no-br no-outline" placeholder="Name work" />
                          
                        </div>
                      )
                    }
                  
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="clear"></div>
        {
          !!nameTask 
          ? (
              <Scrollbars className="hiddenOverX" style={{ height: "60vh" }}>
                <FormAddTask
                  dataProject = {{ name: nameTask }}
                  cateTask    = { cateTask }
                  homeCancel  = { () => this.setState({nameTask: null})}
                  project     = { project } />
              </Scrollbars>
            )
          : <ListTask />
        }
        
        
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { profile, task, project } = state;
  let { friends, cateTask } = state.categories;

  return { profile, friends, cateTask, task, project };
};

let mapDispatchToProps = (dispatch) => {
  return {
    taskActions       : bindActionCreators(taskActions, dispatch),
    cateTaskAction    : bindActionCreators(cateTaskAction, dispatch),
    projectActions    : bindActionCreators(projectActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(CenterHome));