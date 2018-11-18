import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification, Loading, RightSidebar } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import * as groupUserActions from './actions';

import { Error404 } from 'modules';

import Form from './Form';
import Item from './Item';

class ListUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      open    : false,
      idGr  : null
    }
  }

  closeRightSidebar = () => this.setState({open: false, idGr: null});

  onClickEditUser =  (id) => this.setState({open: true, idGr: id});

  formSubmit = (data) => {
    let { idGr } = this.state;
    let { groupUserActions, notification } = this.props;

    groupUserActions.updateById(idGr, data)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        if(!res.data) return Promise.reject({messagse: "unknown error"});
        if(res.data) notification.s('Messagse', 'Update success');
      })
      .catch(e => notification.e('Error', e.messagse))
      .finally( this.setState({open: false, idUser: null}))
  }

  componentDidMount(){
    let { breadcrumbActions, groupUserActions } = this.props;

    breadcrumbActions.set({
      page_name: 'Group user',
      breadcrumb: [{
        name: "Group user",
        liClass: "active"
      }]
    });
    
    groupUserActions.fetchAll();
  }

  render() {
    let { open, idGr } = this.state;
    let { groupUser, profile } = this.props;
    if(!profile || !profile.info || profile.info.account_type !== 0) return <Error404 />
    let { ordered, data } = groupUser;
    let dataGroup = data[idGr];
    if(groupUser.isWorking) return <Loading />;
    
    return (
      <Fragment>
        <RightSidebar
          open = { open } onClose = { this.closeRightSidebar }
          title = "Edit group user"
          color = "success" >
          <Form
            dataGroup           = { dataGroup }
            formSubmit          = { this.formSubmit }
            onClose             = { this.closeRightSidebar } />
        </RightSidebar>

        <div className="row">
          <div className="col-md-12 col-lg-12 col-sm-12">
            <div className="panel">
              <div className="p-10 p-b-0">
              </div>
              <hr style={{marginTop: '10px'}}/>
              <div className="table-responsive">
                <table className="table table-hover manage-u-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th width="200px">Begin day</th>
                      <th width="200px">End day</th>
                      <th width="100px">Max user</th>
                      <th width="100px" className="text-center">Status</th>
                      <th width="100px" className="text-center">Action</th>
                    </tr>
                  </thead>
                  <Item
                    data        = { data }
                    ordered     = { ordered }
                    onClickEdit = { this.onClickEditUser }/>
                </table>
              </div>
              
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

let mapStateToProps = (state) => {
  let { groupUser, profile } = state;
  return { groupUser, profile };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions       : bindActionCreators(breadcrumbActions, dispatch),
    groupUserActions        : bindActionCreators(groupUserActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(ListUser));