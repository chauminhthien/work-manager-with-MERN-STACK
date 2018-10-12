import React, { Component } from 'react';

import { validateForm } from 'utils/validate';
import { convertDMY } from 'utils/format';
import { DayPicker } from 'components';

class FormAdd extends Component {
  _formSubmit       = null;
  _maxUserInput     = null;
  _statusSelect     = null;
  
  constructor(props){
    super(props);
    this.state = {
      end      : null,
      begin    : null,
    }
  }

  onSubmitData = (e) => {
    e.preventDefault();

    let valid = validateForm(this._formSubmit,
      [
        {id: 'max_user', rule: 'int:1:9999'},
        {id: 'status', rule: 'int:0:1'},
      ]
    );

    if(valid){
      let { begin, end } = this.state;
      let max_user  = (!!this._maxUserInput) ? this._maxUserInput.value : null;
      let status    = (!!this._statusSelect) ? this._statusSelect.value : null;

      let data = {};
      if(!!max_user) data.max_user  = max_user;
      if(!!status) data.status      = status;
      if(!!begin) data.begin        = new Date(begin).getTime();
      if(!!end) data.end            = new Date(end).getTime();

      if(!!this.props.formSubmit) this.props.formSubmit(data);
    }
    
  }

  parseDate = (date) => {
    return convertDMY(new Date(date).getTime(), '-');
  }

  render() {
    let { dataGroup } = this.props;
    return (
      <form ref={e => this._formSubmit = e} onSubmit={ this.onSubmitData} className="form-horizontal" style={{paddingBottom: '20px'}}>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Begin daye</label>
            <DayPicker
              formatDate={this.parseDate}
              placeholder={`${ dataGroup ? convertDMY(dataGroup.begin, '-') : null}`}
              onDayChange={begin => this.setState({begin})}/>
            <span className="help-block">Firstname 3 - 100 characters</span>
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>End day</label>
            <DayPicker
              formatDate={this.parseDate}
              placeholder={`${ dataGroup ? convertDMY(dataGroup.end, '-') : null}`}
              onDayChange={end => this.setState({end})}/>
            <span className="help-block">Lastname 3 - 100 characters</span>
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Max user</label>
            <input defaultValue={dataGroup ? dataGroup.max_user : 1}  className="form-control" name="max_user" id="max_user" ref={e => this._maxUserInput = e}/>
            <span className="help-block">Phone invalid</span>
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Status</label>
            <select defaultValue={dataGroup ? dataGroup.status : 1} ref={e => this._statusSelect = e } className="form-control" name="status" id="status">
              <option value={1}> Active</option>
              <option value={0}> Unactive</option>
            </select>
            <span className="help-block">Agency invalid</span>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-flat btn-outline btn-info"><i className="fa fa-check"></i> Save</button>
          <button onClick={this.props.onClose} type="button" className="right-side-toggle btn-flat btn-outline btn btn-danger m-l-15">Cancel</button>
          <div className="clear"></div>
        </div>

      </form>
    );
  }
}


export default FormAdd;