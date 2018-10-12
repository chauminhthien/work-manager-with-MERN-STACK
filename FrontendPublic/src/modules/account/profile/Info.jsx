import React, { Component } from 'react';

class Info extends Component {
  _fullnameInput  = null;
  _formSubmit     = null;
  _phoneInput     = null;
  _addressInput   = null;
  _genderInput    = null;

  handelSubmitInfo = (e) => {
    e.preventDefault();

    let valid = this.props.validateForm(this._formSubmit,
      [
        {id: 'fullname', rule: 'str:3:200'},
        {id: 'phone', rule: 'phone'},
        {id: 'gender', rule: 'int:0:1'},
        {id: 'address', rule: 'str:3:200'}
      ]
    );
    
    if(valid){ 
      let fullname    = (this._fullnameInput != null) ? this._fullnameInput.value : null;
      let phone       = (this._phoneInput != null) ? this._phoneInput.value : null;
      let address     = (this._addressInput != null) ? this._addressInput.value : null;
      let gender      = (this._genderInput != null) ? this._genderInput.value : null;

      if (fullname && phone && address && gender){

        let data = {
          fullname,
          phone,
          address,
          gender
        };

        if(this.props.handelSubmit != null) this.props.handelSubmit(data);

      }

    }
  }

  render() {
    let { profile } = this.props;
    let { info, isWorking } = profile;

    return (
      <form method="post" className={`formSubmit ${ isWorking ? 'loading' : '' }`} onSubmit={ this.handelSubmitInfo }  ref={e => this._formSubmit = e} >
        <div className="form-body">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="email" className="control-label">Email</label>
                <input readOnly form-valid="email:7:100" defaultValue={info ? info.email : ""} name="email" type="email" id="email" className="form-control" placeholder={info ? info.email : ""} />
                <span className="help-block hidden"> Email Invalid </span> 
              </div>
            </div>

            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="fullname" className="control-label">First Name</label>
                <input ref={e => this._fullnameInput = e} form-valid="str:3:200" defaultValue={info ? info.fullname : ""} name="fullname" id="fullname" className="form-control" placeholder={info ? info.fullname : ""} />
                <span className="help-block hidden"> Firstname Invalid </span> 
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="phone" className="control-label">Phone</label>
                <input ref={e => this._phoneInput = e} form-valid="str:3:200" defaultValue={info ? info.phone : ""} name="phone" id="phone" className="form-control" placeholder={ info ? info.phone : ""} />
                <span className="help-block hidden"> Phone Invalid </span> 
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="gender" className="control-label">Gender</label>
                <select ref={e => this._genderInput = e} form-valid="int:0:1" name="gender" id="gender" defaultValue={info ? info.gender : 0} className="form-control">
                  <option value={1}>Male</option>
                  <option value={0}>Female</option>
                </select>
                <span className="help-block hidden"> Gender invalid</span> 
              </div>
            </div>
            
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="address" className="control-label">Address</label>
                <input ref={e => this._addressInput = e} form-valid="str:3:200" defaultValue={info ? info.address : ""} name="address" id="address" className="form-control" placeholder={info ? info.address : ""} />
                <span className="help-block hidden"> Address Invalid </span> 
              </div>
            </div>

          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-flat btn-outline btn-info fcbtn btn-1b"> Update</button>
        </div>
      </form>
    );
  }
}

export default Info;