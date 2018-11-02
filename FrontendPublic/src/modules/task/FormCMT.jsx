import React, { Component } from 'react';
import CKEditor from "react-ckeditor-component";
import Select from 'react-select';

class FormCMT extends Component {
  _attFile = null;

  constructor(props){
    super(props);
    this.state = {
      tag     : false,
      content : null,
      userTags: []
    }
  }

  fileClick = () => !!this._attFile && this._attFile.click();

  descriptionChange = (evt) => {
    let content = evt.editor.getData();
    this.setState({content})
  }

  commentSubmit = () => {
    let { content, userTags } = this.state;
    content = !!content ? content : "";
    content = content.trim();
    if(content.length > 0){
      let data = {
        content,
        userTags,
        time: Date.now()
      }
      
      !!this.props.commentSubmit && this.props.commentSubmit(data) && this.setState({userTags: [], content: null, tag: false});
      
    }
  }

  uploadFileComment = () => { console.log(this._attFile.files[0])
    if(!!this._attFile && !!this._attFile.files[0]) console.log(this._attFile.files[0])
    // this.props.uploadFile(this._inputAvata.files[0]);
  }

  render() {
    let { tag, content, userTags } = this.state;
    let { dataTask, friends } = this.props;
    
    let { memberId } =  dataTask;
    let optionsMember = [];
    let f = false;

    if(!!dataTask && !!dataTask.relateMember && 'push' in dataTask.relateMember){
      for(let val of dataTask.relateMember) {
        if(val.value === memberId) f = true;
        optionsMember.push(val);
      }
    }

    if(!f) optionsMember.push({label: friends.data[memberId].fullname, email: friends.data[memberId].email, value: memberId})

    // optionsMember.push({label: profile.info.fullname, email: profile.info.email, value: profile.info.id})

    return (
      <form className="form-horizontal m-t-15">
        <div className="form-group ">
          <div className="col-xs-12" id="cmtTask">
            <CKEditor
              content={content}
              events={{
                change: this.descriptionChange
              }} />
          </div>
        </div>
        <div className="form-group">
        {
          !!tag && (
            <div className="col-sm-12 m-b-15" >
              <Select
                value     = { userTags }
                isMulti   = { true }
                onChange  = { va => this.setState({userTags: va}) }
                options   = { optionsMember }
                />
            </div>
          )
        }
        
        <div className="col-sm-8">
          <button onClick={ this.fileClick } type="button" className="btn btn-flat btn-outline no-bd">
              <i className="fa fa-paperclip"></i>
          </button>
          <input onChange={ this.uploadFileComment } type="file" style={{display: 'none'}} ref={ e => this._attFile = e} />
          <button onClick={() => this.setState({tag: !tag})} type="button" className="btn btn-flat btn-outline no-bd">
              <i className="fa fa-user-plus"></i>
          </button>
          
        </div>
        <div className="col-sm-4">
          <button 
            type="button"
            onClick={ this.commentSubmit }
            className="pull-right btn btn-flat cbtn btn-outline btn-1e btn-success m-r-5">Send</button>
          
        </div>
      </div>
    </form>
    );
  }
}

export default FormCMT;