import * as React from 'react';
import { Link } from 'react-router-dom';

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer text-center" style={{position: 'fixed'}}> 
        2018 &copy; Admin brought to you by  
        <Link to="http://financial.net.vn/" target="_blank"> http://financial.net.vn</Link>
      </footer>
    );
  }
}

export default Footer;