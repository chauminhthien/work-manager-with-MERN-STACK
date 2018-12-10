import React, { Component } from 'react';

import getIcon from 'config/iconFile';

class Files extends Component {

  getIconFile = (file) => {
    let typeImage = [
      "image/jpg", "image/jpeg", "image/png", "image/gif", "image/tiff",
    ];
    
    if(typeImage.indexOf(file.type) !== -1) return file.url || file.preview;
    return getIcon(file.type);
  }

  render() {

    let { file } = this.props;
    return (
      <div >
          <a href={file.url} target="_blank" style={{cursor: "pointer"}}>
            <div className="dz-image m-b-15">
              <img style={{width: '100px'}} data-dz-thumbnail alt="606500.jpg" src={this.getIconFile(file)}   />
            </div>
          </a>
      </div>
    );
  }
}


export default Files;