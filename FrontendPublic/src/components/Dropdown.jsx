import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Dropdown extends Component {
  constructor(props){
    super(props);
    this.state = {
      show : false
    }
  }
  render() {
    let { icon, children, ...res } = this.props;
    let { show } = this.state;

    return (
      <ul {...res}>
          <li className="dropdown">
              <Link onClick={() => this.setState({show: !show})} className="btn dropdown-toggle waves-effect waves-light" to="#">
                  <i className={icon}></i>
              </Link>
              <ul className={`p-0 dropdown-menu mailbox animated bounceInDown notication ${!!show ? 'show' : ''}`}>
                {!!children ? children : null}
                
              </ul>
          </li>
        </ul>
    );
  }
}
export default Dropdown;