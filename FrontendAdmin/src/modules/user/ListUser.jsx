import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { withNotification } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import { actions as userActions } from 'modules/user';
import { RightSidebar, Loading } from 'components';
import FormAdd from './FormAdd';

class ListUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      open      : false,
      userFetch : false,
      idUser    : null
    }
  }

  getUsers = (profile) => { 
    let { users } = this.props;
    let { userFetch } = this.state;
    if(!!profile.info && users.ordered.length === 0 && !users.isWorking && !userFetch){

      let where = {};

      if(profile.info && profile.info.account_type === 0)
        where = { account_type : 1 };
      else
        where = { created_at : profile.info.id };

      this.props.userActions.fetchAll({}, 0, 0, where)
        .finally( () => this.setState({userFetch: true}))
    }
  }

  componentDidMount(){
    let { breadcrumbActions } = this.props;

    breadcrumbActions.set({
      page_name: 'Dashboard',
      breadcrumb: [{
        name: "Users",
        liClass: "active"
      }]
    });
    
  }

  openRightSidebar = () => {
    this.setState({open: true});
  }

  closeRightSidebar = () => {
    this.setState({open: false, idUser: null});
  }

  formSubmitDataUser = (data) => {
    let { profile, userActions, notification} = this.props;
    let { idUser } = this.state;

    let account_type = (profile.info && profile.info.account_type === 0) ? 1 : 2;
    data.account_type = account_type;
    data.created_at = profile.info.id;

    if(!idUser) {
      userActions.create(data)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        if(!res.data) return Promise.reject({messagse: "unknown error"});
        if(res.data) notification.s('Messagse', 'Create user success');
      })
      .catch(e => notification.e('Error', e.messagse))
      .finally( this.setState({open: false, idUser: null}))
    }
    else {
      userActions.updateById(idUser, data)
        .then(res => {
          if(res.error) return Promise.reject(res.error);
          if(!res.data) return Promise.reject({messagse: "unknown error"});
          if(res.data) notification.s('Messagse', 'Update user success');
        })
        .catch(e => notification.e('Error', e.messagse))
        .finally( this.setState({open: false, idUser: null}))
    }
  }

  onClickEditUser =  (id) => () => {
    this.setState({open: true, idUser: id});
  }

  render() {
    let { open, idUser } = this.state;
    let { users, profile } = this.props;
    let { data, ordered } = users;
    
    if (users.isWorking) return <Loading />;
    if(profile.info) this.getUsers(profile);
    return (
      <Fragment>
        <RightSidebar
          open = {open} onClose = {this.closeRightSidebar}
          title = "Create user"
          color = "success" >
          <FormAdd
            users               = { users }
            profile             = { profile }
            idUser              = { idUser}
            formSubmitDataUser  = { this.formSubmitDataUser }
            onClose             = {this.closeRightSidebar} />
        </RightSidebar>
        <div className="row">
          <div className="col-md-12 col-lg-12 col-sm-12">
            <div className="panel">
              <div className="p-10 p-b-0">
                <form method="post" action="#" id="filter">
                  <Link onClick={ this.openRightSidebar } to="#" className="btn btn-success pull-right">
                    <i className="fa fa-plus" /> Create new user
                  </Link>
                  <div className="clear"></div>
                </form>
              </div>
              <hr style={{marginTop: '10px'}}/>
              <div className="table-responsive">
                <table className="table table-hover manage-u-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Fullname</th>
                      <th>Gender</th>
                      <th>Member</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      ordered.length > 0
                      ? (
                        ordered.map( (e, i) => {
                          return (
                            <tr key={i}>
                              <td>
                                <span className="font-medium">{data[e].email}</span>
                              </td>
                              <td>
                                <span className="font-medium">{`${data[e].fullname}`}</span>
                              </td>
                              <td>{ (data[e].gender && data[e].gender === 1) ? 'Male' : 'Female' }</td>
                              <td>
                                a
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
  let { users, profile } = state;

  return { users, profile };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions       : bindActionCreators(breadcrumbActions, dispatch),
    userActions             : bindActionCreators(userActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(ListUser));