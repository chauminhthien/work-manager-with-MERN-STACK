import * as React from 'react';

class Select extends React.Component {
  _selectHtml = null;

  onChange = (e: any) => {
    let select = (this._selectHtml != null) ? this._selectHtml.value : null;
    if(!!this.props.onChange) this.props.onChange(select);
  }

  componentDidMount(){
    if( undefined !== this.props.refHTML) this.props.refHTML(this._selectHtml)
  }

  render() {
    let {options, defaultValue, refHTML, onChange, className, disabled, ...rest} = this.props;

    disabled = (disabled) ? {disabled: 'disabled'} : '';
    return (
      <select ref={e => this._selectHtml = e} onChange={ this.onChange } {...disabled} defaultValue={defaultValue} className={`form-control ${(className) ? className : ''}`} {...rest}>
        {
          (!!options && options.length > 0)
          ? (
            options.map( (e, i) => {
              let { value, text, ...re } = e;
              return (<option key={i} value={value ? value : ""} {...re}>{text ? text : ""}</option>)
            } )
          )
          : null
        }
      </select>
    );
  }
}

export default Select;
