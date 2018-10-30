import React, { Component } from 'react';

import CenterHome from './CenterHome';
import { ListProject } from 'modules/project';
import { ListActions } from 'modules/actions';

class DashBoard extends Component {

  render() {
    let { history } = this.props;

    return (
      <div className="row">
        <div id="projectList" className="col-xs-2 p-0 p-l-15">
          <ListProject />
        </div>

        <div className="col-xs-7 p-0 h-100 bd-r">
          <CenterHome history={ history } />
        </div>

        <div className="col-xs-3 p-0 p-r-15 h-100">
          <ListActions />
        </div>
      </div>
    );
  }
}


export default DashBoard;