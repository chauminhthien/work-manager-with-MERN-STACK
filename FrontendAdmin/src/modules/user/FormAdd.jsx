import React, { Component, Fragment } from 'react';

import { validateForm, validate } from 'utils/validate';
import { DayPicker } from 'components';

class FormAdd extends Component {
  _emailInput       = null;
  _passInput        = null;
  _fullnameInput    = null;
  _phoneInput       = null;
  _addressInput     = null;
  _formData         = null;
  _genderSelect     = null;
  _maxUserInput    = null;
  _statusSelect     = null;

  constructor(props){
    super(props);
    this.state = {
      userEditID  : null,
      end         : null,
      begin       : null
    }
  }


  onSubmitData = (e) => {
    e.preventDefault();
    let { idUser } = this.props;

    let valid = validateForm(this._formSubmit,
      [
        {id: 'email', rule: 'email:7:200'},
        {id: 'fullname', rule: 'str:3:200'},
        {id: 'lastname', rule: 'str:3:200'},
        {id: 'phone', rule: 'phone'},
        {id: 'address', rule: 'str:3:200'},
        {id: 'gender', rule: 'int:0:1'}
      ]
    );
    
    if(idUser && this._passInput != null && this._passInput.value !== "") 
      valid = validate(this._passInput, 'str:6:32');
    else if(!idUser && this._passInput != null) valid = validate(this._passInput, 'str:6:32');

    if(this._maxUserInput != null) valid = validate(this._channelSelect, 'int:1:9999');
    if(this._statusSelect != null) valid = validate(this._statusSelect, 'int:0:1');
    
    if(valid){
      let email       = (this._emailInput != null) ? this._emailInput.value : null;
      let password    = (this._passInput != null) ? this._passInput.value : null;
      let fullname   = (this._fullnameInput != null) ? this._fullnameInput.value : null;
      let phone       = (this._phoneInput != null) ? this._phoneInput.value : null;
      let address     = (this._addressInput != null) ? this._addressInput.value : null;
      let gender      = (this._genderSelect != null) ? this._genderSelect.value : null;
      let max_user    = (this._maxUserInput != null) ? this._maxUserInput.value : null;

      let { end, begin } = this.state;

      if(email && fullname && phone && address && gender){
        
        let data = {
          email,
          fullname,
          phone,
          address,
          gender,
          max_user,
          
        }
        
        let fl = true;
        if(!idUser) {
          fl = false;
          data.password = password;
          if(end && begin){
            fl = true;
            data.end   = new Date(end).getTime();
            data.begin = new Date(begin).getTime();
          }
        }
        else if(password) data.password = password;
        if(this._statusSelect != null) data.status = this._statusSelect.value;
        
        if(fl)
          if(!!this.props.formSubmitDataUser) this.props.formSubmitDataUser(data);
      }
    }
  }

  renderFooter = () => {
    let { users, idUser, profile } = this.props;
    let user = (idUser) ? users.data[idUser] : null;

    if (!profile.info || profile.info.account_type === 1 || user) return null;

    return (
      <Fragment>
        <div className="form-group">
          <div className="col-xs-12">
            <label>Max user</label>
            <input defaultValue={1} className="form-control" name="maxuser" id="maxuser" ref={e => this._maxUserInput = e} />
          </div>
        </div>
        <div className="form-group">
          <div className="col-xs-12">
            <label>Begin date</label>
            <DayPicker onDayChange={begin => this.setState({begin})}/>
          </div>
        </div>
        <div className="form-group">
          <div className="col-xs-12">
            <label>End date</label>
            <DayPicker onDayChange={end => this.setState({end})} />
          </div>
        </div>
      </Fragment>
    );
  }

  render() {
    let { users, idUser } = this.props;
    let user = (idUser) ? users.data[idUser] : null;

    return (
      <form ref={e => this._formData = e} onSubmit={ this.onSubmitData } className="form-horizontal" style={{paddingBottom: '20px'}}>
        <div className="form-group">
          <div className="col-xs-12">
            <label>Email address</label>
            <input defaultValue={ user ? user.email : "" } className="form-control" name="email" id="email" ref={e => this._emailInput = e} />
            <span className="help-block">Email invalid or 7 - 100 characters</span>
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Password</label>
            <input className="form-control" name="password" id="password" type="password" ref={e => this._passInput = e} />
            <span className="help-block">Email invalid or 7 - 100 characters</span>
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Fullname</label>
            <input defaultValue={ user ? user.fullname : "" } className="form-control" name="fullname" id="fullname" ref={e => this._fullnameInput = e} />
            <span className="help-block">Lastname 3 - 100 characters</span>
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Phone</label>
            <input defaultValue={ user ? user.phone : "" } className="form-control" name="phone" id="phone" ref={e => this._phoneInput = e}/>
            <span className="help-block">Phone invalid</span>
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Address</label>
            <input defaultValue={ user ? user.address : "" } className="form-control" name="address" id="address" ref={e => this._addressInput = e} />
            <span className="help-block">Address 5 - 200 characters</span>
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Gender</label>
            <select defaultValue={ user ? user.gender : 1 } ref={e => this._genderSelect = e } className="form-control" name="gender" id="gender">
              <option> -- Select Gender</option>
              <option value={1}> Male</option>
              <option value={0}> Female</option>
            </select>
            <span className="help-block">Agency invalid</span>
          </div>
        </div>

        {
          user
          ? (
            <div className="form-group">
              <div className="col-xs-12">
                <label>Status</label>
                <select defaultValue={ user ? user.status : 1 } ref={e => this._statusSelect = e } className="form-control" name="status" id="status">
                  <option value={1}> Active</option>
                  <option value={0}> Unactive</option>
                </select>
                <span className="help-block">Agency invalid</span>
              </div>
            </div>
          )
          : null
        }

        {this.renderFooter()}

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