import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import CKEditor from "react-ckeditor-component";

import { withNotification } from 'components';
import img_wellcome from 'assets/Images/img-wellcome.png';
import ItemFile from './ItemFile';
import * as projectActions from './actions';

import users        from 'assets/Images/user.jpg';

class ViewTask extends Component {
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
    let { project, match, profile } = this.props;
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
            {
              true &&
              (
                <Link to={`/task/edit/${id ? id : ""}`} className="m-l-15 btn btn-info btn-flat">Edit</Link>
              )
            }
            
          </div>
          
          <h2 className="box-title">{dataProject.name}</h2>

        </div>
        <div className="clear"></div>
        <h3 className="box-title m-b-0"><i className="ti-pencil m-r-5">
          </i>Description<span className="clearfix"></span>
        </h3>
        {
          dataProject.description && dataProject.description !== "" && (<div style={{padding: '15px'}} className="fileResult" dangerouslySetInnerHTML={{__html: dataProject.description}}></div>)
        }
        
        <ItemFile files = { dataProject.files } />
        <div className="clear"></div>
        <form className="form-horizontal m-t-15">
          <div className="form-group">
            <div className="col-sm-12">
              <Link className="btn btn-block btn-flat cbtn btn-outline btn-1e btn-info" to="/">New task</Link>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-6">
              <Link className="btn btn-flat cbtn btn-outline btn-1e btn-danger m-r-5" to="/">Cancel</Link>
              <Link className="btn btn-flat cbtn btn-outline btn-1e btn-success m-r-5" to="/">Confirm</Link>
              <Link className="btn btn-flat cbtn btn-outline btn-1e btn-info" to="/">Update work progress</Link>
            </div>
            <div className="col-sm-6">
              <h5>Photoshop<span className="pull-right">85%</span></h5>
              <div className="progress">
                <div className="progress-bar progress-bar-danger" style={{width: '85%'}} role="progressbar">
                  <span className="sr-only">60% Complete</span> 
                </div>
              </div>
            </div>
          </div>
        </form>

        <Scrollbars className={`hiddenOverX ${!!isWoring ? 'loading' : ''}`} style={{height: '40vh'}}>
          <form className="form-horizontal m-t-15">
            <div className="form-group ">
              <div className="col-xs-12" id="cmtTask">
                <CKEditor
                  content={this.state.description}
                  id="a"
                  events={{
                    change: this.descriptionChange
                  }} />
              </div>
            </div>
            <div className="form-group">
            <div className="col-sm-8">
              <button type="button" className="btn btn-flat btn-outline no-bd">
                  <i className="fa fa-paperclip"></i>
              </button>
              <button type="button" className="btn btn-flat btn-outline no-bd">
                  <i className="fa fa-user-plus"></i>
              </button>
              
            </div>
            <div className="col-sm-4">
              <Link className="pull-right btn btn-flat cbtn btn-outline btn-1e btn-success m-r-5" to="/">Send</Link>
            </div>
          </div>
          </form>
          <hr />
          <div style={{paddingBottom: "200px"}}>
            <div className="media">
              <div className="media-left">
                <Link to="#"> <img alt="64x64" className="media-object" src={users} data-holder-rendered="true" style={{width: 64, height: 64}} /> </Link>
              </div>
              <div className="media-body">
                <h4 className="media-heading">Media heading</h4> Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus. </div>
            </div>
            <div className="media">
              <div className="media-left">
                <Link to="#"> <img alt="64x64" className="media-object" src={users} data-holder-rendered="true" style={{width: 64, height: 64}} /> </Link>
              </div>
              <div className="media-body">
                <h4 className="media-heading">Media heading</h4> Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                <div className="media">
                  <div className="media-left">
                    <Link to="#"> <img alt="64x64" className="media-object" src={users} data-holder-rendered="true" style={{width: 64, height: 64}} /> </Link>
                  </div>
                  <div className="media-body">
                    <h4 className="media-heading">Nested media heading</h4> Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus. </div>
                </div>
              </div>
            </div>
            <div className="media">
              <div className="media-body">
                <h4 className="media-heading">Media heading</h4> Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. </div>
              <div className="media-right">
                <Link to="#"> <img alt="64x64" className="media-object" src={users} data-holder-rendered="true" style={{width: 64, height: 64}} /> </Link>
              </div>
            </div>
            <div className="media">
              <div className="media-left">
                <Link to="#"> <img alt="64x64" className="media-object" src={users} data-holder-rendered="true" style={{width: 64, height: 64}} /> </Link>
              </div>
              <div className="media-body">
                <h4 className="media-heading">Media heading</h4> Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. </div>
              <div className="media-right">
                <Link to="#"> <img alt="64x64" className="media-object" src={users} data-holder-rendered="true" style={{width: 64, height: 64}} /> </Link>
              </div>
            </div>
          </div>
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

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(ViewTask));