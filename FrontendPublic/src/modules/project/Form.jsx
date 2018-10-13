import React, { Component } from 'react';
import CKEditor from "react-ckeditor-component";

import { DayPicker, Dropzone } from 'components';
import Select from 'react-select';
import { isEmpty } from 'utils/functions';
import { convertDMY } from 'utils/format';
import { validate } from 'utils/validate';

class Form extends Component {
  _formSubmit = null;
  _inputName  = null;

  constructor(props){
    super(props);
    this.state = {
      selectedFrOption  : null,
      description       : "",
      file              : [],
      begin             : null,
      end               : null,
      dataError         : {}
    }
  }

  formProjectSubmit = () => {
    if(validate(this._inputName, 'str:3:200')){
      let name = (!!this._inputName) ? this._inputName.value : null;
      let { selectedFrOption, description, file, begin, end, dataError} = this.state;

      dataError = {};

      if(!selectedFrOption || !('push' in selectedFrOption) || isEmpty(selectedFrOption))
        dataError.selectedFrOption = true;

      if(!begin) dataError.begin  = true;
      if(!end) dataError.end    = true;

      if(isEmpty(dataError)){
        
        let memberJoin = [];
        let data = {
          name,
          begin,
          end,
          description,
          memberJoin: selectedFrOption
        }

        console.log(data);

      }
      this.setState({dataError});
    }
  }

  setTime = (key) => (val) => {
    val = new Date(val).getTime();
    this.setState({[key]: val});
  }

  parseDate = (date) => convertDMY(new Date(date).getTime(), '-');

  render() {
    let { friends } = this.props;
    let { selectedFrOption, dataError } = this.state;

    const optionsFr = [];
    if('push' in friends.ordered && !isEmpty(friends.ordered)){
      friends.ordered.forEach(e => {
        optionsFr.push({value: friends.data[e].id, label: friends.data[e].fullname})
      })
    }

    return (
      <form className="form-horizontal new-lg-form formSubmit p-r-15" method="post" ref={e => this._formSubmit = e} onSubmit={ this.onSubmitFormLogin } name="myform" noValidate >
        <div className="form-group">
          <div className="col-xs-12">
            <label>Name project</label>
            <input ref={e => this._inputName = e} className="form-control" id="name" name="name" placeholder="Name project" />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Description</label>
            <CKEditor
              />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>File attachments</label>
            <Dropzone onDrop={e => console.log(e)} />
          </div>
        </div>

        <div className="form-group">
          <div className={`col-xs-6 ${!!dataError.end ? 'error-more' : ''}`}>
            <label>Begin day</label>
            <DayPicker
              ref         = { e => this.test = e } 
              onDayChange = { this.setTime('begin') }
              formatDate  = { this.parseDate } />
          </div>

          <div className={`col-xs-6 ${!!dataError.end ? 'error-more' : ''}`}>
            <label>End day</label>
            <DayPicker
              onDayChange = { this.setTime('end') }
              formatDate  = { this.parseDate } />
          </div>

        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Member join</label>
            <Select
              className = {!!dataError.selectedFrOption ? 'bd-danger' : ''}
              value     = { selectedFrOption }
              isMulti   = { true }
              onChange  = { va => this.setState({selectedFrOption: va}) }
              options   = { optionsFr }
            />
          </div>
        </div>
        <div className="form-group m-t-20">
          <div className="col-xs-12">
            <button 
              type      = "button"
              onClick   = { this.formProjectSubmit }
              className = "btn-outline btn-flat btn btn-info fcbtn btn-1b btn-lg text-uppercase waves-effect waves-light">Submit</button>
          </div>
        </div>

      </form>
    );
  }
}

export default Form;