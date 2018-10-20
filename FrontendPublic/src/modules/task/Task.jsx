import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import NewTask from './NewTask';
import { ListProject } from 'modules/project';
import { ListActions } from 'modules/actions';
import { Error404 } from 'modules';

class Task extends Component {

  render() {
    
    return (
      <div className="row">
        <div id="projectList" className="col-xs-2 p-0 p-l-15">
          <ListProject location={this.props.location} />
        </div>

        <div className="col-xs-7 p-0 h-100 bd-r">
          <Switch>
            <Route path="/task/new/:id" component={ NewTask } />
            <Route component={ Error404 } />
          </Switch>
        </div>

        <div className="col-xs-3 p-0 p-r-15 h-100">
          <ListActions />
        </div>
      </div>
    );
  }
}


export default withRouter(Task);