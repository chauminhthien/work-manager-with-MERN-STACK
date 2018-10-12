import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import img_wellcome from 'assets/Images/img-wellcome.png';
import { DayPicker, Dropzone } from 'components';
import Select from 'react-select';

class FormProject extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedOption: null
    }
  }
  render() {

    let { selectedOption } = this.state;
    const options = [
      { value: 'chauminhthien', label: 'Châu Minh Thiện' },
      { value: 'chauminhthien2', label: 'Thiên Min Chậu' },
      { value: 'chauminhthien3', label: 'Nguyễn Văn A' }
    ];

    return (
      <div className="white-box">
        <div className="col-xs-3">
          <img alt="img" src={img_wellcome} />
        </div>
        <div className="col-xs-9 m-t-30">
          <h2 className="box-title">Create new project</h2>
          <p>Start assigning and completing the work of yourself and your colleagues.</p>
        </div>
        <div className="clear"></div>
        <hr />
        <Scrollbars className="hiddenOverX" style={{height: '65vh'}}>
          <form className="form-horizontal new-lg-form formSubmit p-r-15" method="post" ref={e => this._formSubmit = e} onSubmit={ this.onSubmitFormLogin } name="myform" noValidate >
            <div className="form-group">
              <div className="col-xs-12">
                <label>Name project</label>
                <input  className="form-control" id="name" name="name" placeholder="Name project" />
              </div>
            </div>

            <div className="form-group">
              <div className="col-xs-12">
                <label>Description</label>
                <textarea 
                  className   = "form-control"
                  id          = "description"
                  name        = "description"
                  rows        = { 3 }
                  placeholder =  "Description" ></textarea>
              </div>
            </div>

            <div className="form-group">
              <div className="col-xs-12">
                <label>File attachments</label>
                <Dropzone onDrop={e => console.log(e)} />
              </div>
            </div>

            <div className="form-group">
              <div className="col-xs-6">
                <label>Begin day</label>
                <DayPicker />
              </div>

              <div className="col-xs-6">
                <label>End day</label>
                <DayPicker />
              </div>

            </div>

            <div className="form-group">
              <div className="col-xs-12">
                <label>Member join</label>
                <Select
                  value={selectedOption}
                  isMulti={true}
                  onChange={va => this.setState({selectedOption: va})}
                  options={options}
                />
              </div>
            </div>

          

            <div className="form-group text-center m-t-20">
              <div className="col-xs-12">
                <button className="btn-outline btn btn-info fcbtn btn-1b btn-lg btn-block btn-rounded text-uppercase waves-effect waves-light" type="submit">Submit</button>
              </div>
            </div>

          </form>
        </Scrollbars>
      </div>
    );
  }
}


export default FormProject;