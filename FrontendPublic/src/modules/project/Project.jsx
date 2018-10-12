import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import ListProject from './ListProject';
import FormProject from './FormProject';
import { ListActions } from 'modules/actions';
import { Error404 } from 'modules';

class Project extends Component {

  render() {
    return (
      <div className="row">
        <div id="projectList" className="col-xs-2 p-0 p-l-15">
          <ListProject />
        </div>

        <div className="col-xs-7 p-0 h-100 bd-r">
          <Switch>
            <Route path="/project/add" component={ FormProject } />
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


export default withRouter(Project);