import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { withNotification, Loading, RightSidebar, AlertConfirm } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import * as cateTaskActions from './actions';
import Item from './Item';
import Form from './Form';

class List extends Component {

  constructor(props){
    super(props);
    this.state = {
      open        : false,
      idUpdate    : null,
      idDelete    : null
    }
  }

  componentDidMount(){
    let { breadcrumbActions, profile, cateTaskActions, cateTask } = this.props;
    let { account_type, groupUserID } = profile.info;

    let where = { default: 1 };
    if(!!account_type) where = {
      groupUserID,
      removed: 0,
      default: 0
    }

    if(cateTask.ordered.length === 0) cateTaskActions.fetchAll({}, 0, 0, where);

    breadcrumbActions.set({
      page_name: 'Category task',
      breadcrumb: [{name: "Categories"}, {name: "Category task", liClass: "active"}]
    });
    
  }

  openRightSidebar = () => this.setState({open: true});

  closeRightSidebar = () =>  this.setState({open: false, idUpdate: null});

  onClickEdit =  (id) => this.setState({open: true, idUpdate: id});
  onClickDelete = (e) => this.setState({idDelete: e});

  onDeleteItem = () => {
    let { profile, cateTaskActions, notification } = this.props;
    let { account_type } = profile.info;
    let { idDelete } = this.state;

    if(!!account_type)
      cateTaskActions.updateById(idDelete, {removed: 1})
        .then(res => {
          if(!!res.error) return Promise.reject(res.error.messagse)
            notification.s('Message', "Delete success");
        })
        .catch(e => notification.e("Error", e.toString()))
        .finally(() => this.setState({idDelete: null}))
    else cateTaskActions.deleteById(idDelete)
          .then(res => {
            if(!!res.error) return Promise.reject(res.error.messagse)
            notification.s('Message', "Delete success");
          })
          .catch(e => notification.e("Error", e.toString()))
          .finally(() => this.setState({idDelete: null}))
  }


  formSubmitData = (data) => {
    let { profile, cateTaskActions, notification } = this.props;
    let { account_type, groupUserID } = profile.info;
    let { idUpdate } = this.state;

    if(!!account_type && idUpdate == null){
      data.groupUserID  = groupUserID;
      data.default      = 0;
    }

    if(!!idUpdate){
      cateTaskActions.updateById(idUpdate, data)
        .then(res => {
          if(!!res.error) return Promise.reject(res.error.messagse)
            notification.s('Message', "Update item success");
        })
        .catch(e => notification.e("Error", e.toString()))
        .finally(() => this.setState({open: false, idUpdate: null}))
    }else{
      cateTaskActions.create(data)
        .then(res => {
          if(!!res.error) return Promise.reject(res.error.messagse)
              notification.s('Message', "Create item success");
        })
        .catch(e => notification.e("Error", e.toString()))
        .finally(() => this.setState({open: false, idUpdate: null}))
    }
  }

  render() {

    let { open, idUpdate, idDelete } = this.state;
    let { cateTask } = this.props;
    let { ordered, data } = cateTask;
    let dataGroup = data[idUpdate];
    
    if(cateTask.isWorking) return <Loading />;

    return (
      <Fragment>
        <RightSidebar
          open = { open } onClose = { this.closeRightSidebar }
          title = {`${ idUpdate ? "Edit" : "Create"} category task`}
          color = "success" >
          <Form
            dataGroup           = { dataGroup }
            formSubmitData      = { this.formSubmitData }
            onClose             = { this.closeRightSidebar } />
        </RightSidebar>

        {
           idDelete
          ?
          ( 
            <AlertConfirm
              onCancel= { () => this.setState({idDelete: null})}
              onSuccess= { this.onDeleteItem }
              title="Are you sure!"/>
          )
          : null
        }

        <div className="row">
          <div className="col-md-12 col-lg-12 col-sm-12">
            <div className="panel">
              <div className="p-10 p-b-0">
                <Link onClick={ this.openRightSidebar } to="#" className="btn btn-success pull-right">
                  <i className="fa fa-plus" /> Create new item
                </Link>
              </div>
              <div className="clear"></div>
              <hr style={{marginTop: '10px'}}/>
              <div className="table-responsive">
                <table className="table table-hover manage-u-table">
                  <thead>
                    <tr>
                      <th width="50px" className="text-center">STT</th>
                      <th>Name</th>
                      <th width="50px">Icon</th>
                      <th width="100px" className="text-center">Action</th>
                    </tr>
                  </thead>
                  <Item
                    onClickEdit       = { this.onClickEdit }
                    onClickDelete     = { this.onClickDelete }
                    data              = { data }
                    ordered           = { ordered }/>
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
  let { cateTask } = state.categories;

  return { groupUser, cateTask, profile };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions       : bindActionCreators(breadcrumbActions, dispatch),
    cateTaskActions         : bindActionCreators(cateTaskActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(List));