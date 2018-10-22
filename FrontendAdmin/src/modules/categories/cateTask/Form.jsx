import React, { Component } from 'react';

import { validateForm, validate } from 'utils/validate';

class Form extends Component {
  _nameInput          = null;
  _iconInput          = null;
  _formData           = null;

  onSubmitData = (e) => {
    e.preventDefault();

    let valid = validateForm(this._formData,
      [
        {id: 'name', rule: 'str:3:200'},
        {id: 'icon', rule: 'str:3:50'}
      ]
    );

    if(valid && !!this._statusSelect) valid = validate(this._statusSelect, 'int:0:1');
    
    if(valid){
      let name            = (this._nameInput != null) ? this._nameInput.value : null;
      let icon            = (this._iconInput != null) ? this._iconInput.value : null;
      
      let data = { name, icon }

      if(!!this.props.formSubmitData) this.props.formSubmitData(data);
    }
  }

  render() {
    let { dataGroup } = this.props;
    
    return (
      <form ref={e => this._formData = e} onSubmit={ this.onSubmitData } className="form-horizontal" style={{paddingBottom: '20px'}}>
        <div className="form-group">
          <div className="col-xs-12">
            <label>Name</label>
            <input defaultValue={ dataGroup ? dataGroup.name : "" } className={`form-control`} name="name" id="name" ref={e => this._nameInput = e} />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Icon</label>
            <input defaultValue={ dataGroup ? dataGroup.icon : "" } className={`form-control`} name="icon" id="icon" ref={e => this._iconInput = e} />
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


export default Form;