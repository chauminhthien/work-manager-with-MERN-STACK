import * as React from 'react';
import 'rc-time-picker/assets/index.css';
import TimePicker from 'rc-time-picker';
import './TimePicker.css';

class TPickKer extends React.Component {


  render() {

    return (
      <TimePicker id="TimePicker" {...this.props}  showSecond={false}/>
    );
  }
}

export default TPickKer;
