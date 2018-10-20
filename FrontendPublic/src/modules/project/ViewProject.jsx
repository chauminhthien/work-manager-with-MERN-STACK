import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { withNotification } from 'components';
import img_wellcome from 'assets/Images/img-wellcome.png';
import ItemFile from './ItemFile';
import * as projectActions from './actions';

import users        from 'assets/Images/user.jpg';

class ViewProject extends Component {
  constructor(props){
    super(props);
    this.state = {
      isWoring : false
    }
  }

  componentDidMount(){
    let { profile, project, projectActions } = this.props;

    if(project.ordered.length === 0){
      projectActions.fetchAll({

      },0, 0, {
        groupUserID: profile.info.groupUserID
      })
    }
  }

  render() {
    let { project, match, friends, profile } = this.props;
    let { isWoring } = this.state;

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

    if(profile.info.id !== dataProject.createAt && !fl) return null;
    return (
      <div className="white-box">
        <div className="col-xs-3">
          <img alt="img" src={img_wellcome} />
        </div>
        <div className="col-xs-9 m-t-30">
          <div className="pull-right">
            
            <Link to={`/task/new/${id ? id : ""}`} className="btn btn-info btn-flat">Create new task</Link>
            {
              dataProject.createAt === profile.info.id &&
              (
                <Link to={`/project/edit/${id ? id : ""}`} className="m-l-15 btn btn-info btn-flat">Edit</Link>
              )
            }
            
            {/* <Dropdown className="pull-right" icon="ti-settings" >
              <Link to="" className="btn btn-block btn-info btn-flat">Create new task</Link>
            </Dropdown> */}
            {/* <button className="btn btn-outline btn-info btn-flat bd-0 m-l-15">
              <i className="ti-settings" />
            </button> */}
            
          </div>
          
          <h2 className="box-title">{dataProject.name}</h2>
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
              <input type="text" className="form-control" placeholder="Enter keywork" />
            </div>
          </div>
        </form>

        <Scrollbars className={`hiddenOverX ${!!isWoring ? 'loading' : ''}`} style={{height: '40vh'}}>
          <ul className="list-group no-br">
            <li className="list-group-item no-br br-b m-b-5 min-h-50">
              Chủ nhật (23/09/2018)
            </li>
            {[...Array(20)].map( (e, i) => {
              return (
                <li key={i} className="list-group-item no-br br-b m-b-5 min-h-50">
                  <Link to="#">
                    <div className="col-xs-6 p-l-0">
                      <img width="20px" alt={'users'} className="circle m-r-5" src={users}/>
                      <i className="fa fa-phone m-r-5 text-default"></i>
                      <span className="text-danger">Test tạo công việc -  {i}</span>
                    </div>
                    <div className="col-xs-6">
                      <div className="col-xs-7 m-t-7">
                        <div className="progress">
                          <div className="progress-bar progress-bar-danger" style={{width: '60%'}} role="progressbar">
                            <span className="sr-only">60% Complete</span> 
                          </div>
                        </div>
                      </div>
                      <div className="col-xs-5 text-default">
                        (Đang tiến hành)
                      </div>
                    </div>
                    <div className="clear"></div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </Scrollbars>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { profile, project } = state;
  let { friends }           = state.categories
  return { profile, project, friends };
};

let mapDispatchToProps = (dispatch) => {
  return {
    projectActions       : bindActionCreators(projectActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(ViewProject));