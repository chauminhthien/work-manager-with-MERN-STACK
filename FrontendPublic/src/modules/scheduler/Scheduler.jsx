import React, { Component } from 'react';
import moment from 'moment'
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions as taskActions } from 'modules/task';

class Scheduler extends Component {

  constructor(p){
    super(p);
    this.state = {
      ev : []
    }
  }
  componentDidMount(){
    let { taskActions } = this.props;
    taskActions.getTaskScheduler()
      .then(r => {
        r = r.filter(e => {
          e.start = new Date(e.start);
          e.end = new Date(e.end);
          return e;
        });
        
        this.setState({ev: r});
      });
  }

  detailTask = (event) => {
    let { id, projectId } = event;
    let { history } = this.props;
    history.push(`/task/view/${id}?project=${projectId}`)
  }

  render() {
    let { ev } = this.state;
    const localizer = BigCalendar.momentLocalizer(moment);
    return (
      <div className="row" style={{height: 500}}>
       <div className="white-box p-30" >
         <BigCalendar
            localizer={localizer}
            events={ev}
            onSelectEvent={event => this.detailTask(event) }
            startAccessor="start"
            endAccessor="end"
          />
       </div>
        
      </div>
    );
  }
}


let mapStateToProps = (state) => {

  return { };
};

let mapDispatchToProps = (dispatch) => {
  return {
    taskActions       : bindActionCreators(taskActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);