import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { isEmpty } from 'utils/functions';
import getIcon from 'config/iconFile';

class ItemFile extends Component {

  getIconFile = (file) => {
    let typeImage = [
      "image/jpg", "image/jpeg", "image/png", "image/gif", "image/tiff",
    ];
    
    if(typeImage.indexOf(file.type) !== -1) return file.url || file.preview;
    return getIcon(file.type);
  }

  handelRemoveClick = (id) => (e) => {
    !!this.props.handelRemoveClick && this.props.handelRemoveClick(id);
  }

  render() {
    let { files } = this.props;
    if(!files || isEmpty(files)) return null;

    return (
      <div className="fileResult">
        {files.map((e, i)=>{
          return(
            <div key={i} className="dz-preview dz-processing dz-success dz-complete dz-image-preview p-30">
              <a href={e.url} target="_blank" style={{cursor: "pointer"}}>
                <div className="dz-image">
                  <img data-dz-thumbnail alt="606500.jpg" src={this.getIconFile(e)}   />
                </div>
              </a>
              {
                !!this.props.handelRemoveClick && (
                  <Link onClick={this.handelRemoveClick(i)} className="dz-remove" to="#" data-dz-remove>
                    <i style={{fontSize: "15px", color: "#000"}} className="fa fa-trash"></i>
                  </Link>
                )
              }
            </div>
          )
        })}
        <div className="clear"></div>
      </div>
    );
  }
}

export default ItemFile;