import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification, Loading, RightSidebar } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import * as groupUserActions from './actions';
import { convertDMY } from 'utils/format';
import Form from './Form';

class ListUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      open    : false,
      idGr  : null
    }
  }

  closeRightSidebar = () => {
    this.setState({open: false, idGr: null});
  }

  onClickEditUser =  (id) => () => {
    this.setState({open: true, idGr: id});
  }

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
    let { groupUser } = this.props;
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
                  <tbody>
                    {
                      (ordered.length > 0)
                      ? (
                        ordered.map( (e, i) => {
                          return (
                            <tr key={i}>
                              <td>
                                <span className="font-medium">
                                  {data[e].name}
                                </span>
                              </td>
                              <td>
                                <span className="font-medium">
                                  {convertDMY(data[e].begin, '-')}
                                </span>
                              </td>
                              <td>
                                <span className="font-medium">
                                  {convertDMY(data[e].end, '-')}
                                </span>
                              </td>
                              <td>
                                <span className="font-medium">
                                  {data[e].max_user}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className={`label label-${ (data[e].status && data[e].status === 1) ? 'success' : 'danger' }`}>
                                  { (data[e].status && data[e].status === 1) ? 'Active' : 'Unactive' }
                                </span>
                              </td>
                              <td className="text-center">
                                <button onClick={ this.onClickEditUser(e) } className="btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                                  <i className=" ti-pencil" aria-hidden="true"></i>
                                </button>
                                {/* <button className="btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                                  <i className="ti-trash" aria-hidden="true"></i>
                                </button> */}
                              </td>
                            </tr>
                          )
                        })
                      )
                      : null
                    }
                  </tbody>
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
  let { groupUser } = state;

  return { groupUser };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions       : bindActionCreators(breadcrumbActions, dispatch),
    groupUserActions        : bindActionCreators(groupUserActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(ListUser));