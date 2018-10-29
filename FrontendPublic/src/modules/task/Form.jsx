import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CKEditor from "react-ckeditor-component";

import { DayPicker, Dropzone, TimePicker, Select as SelectOP } from 'components';
import Select from 'react-select';
import { isEmpty } from 'utils/functions';
import { convertDMY, convertMDY, convertHM } from 'utils/format';
import { validate } from 'utils/validate';
import * as fileConfig from 'config/fileConfig';
import ItemFile from './ItemFile';

class Form extends Component {
  _formSubmit = null;
  _inputName  = null;

  constructor(props){
    super(props);
    this.state = {
      selectedFrOption  : null,
      cateTaskId        : null,
      idProject         : null,
      description       : "",
      files             : [],
      begin             : null,
      end               : null,
      beginTime         : null,
      endTime           : null,
      dataError         : {}
    }
  }
  
  componentWillReceiveProps(nextProps){
    let { dataTask, project, idProject } = nextProps;
    
    if(!!dataTask && Object.keys(dataTask).length > 0){
      let { begin, end, description, memberId, files, cateTaskId } = dataTask;
      if(!!project.data[idProject] && !!project.data[idProject].memberJoins){
        for(let val of project.data[idProject].memberJoins){
          if(memberId === val.value) {
            memberId = val;
            break;
          };
        }
      }

      this.setState({...this.state, cateTaskId, beginTime: begin, begin, endTime: end, end, description, selectedFrOption: memberId, files})
    }
  }

  componentDidMount(){
    let { dataTask, project, idProject } = this.props;
    
    if(!!dataTask && Object.keys(dataTask).length > 0){
      let { begin, end, description, memberId, files, cateTaskId } = dataTask;
      if(!!project.data[idProject] && !!project.data[idProject].memberJoins){
        for(let val of project.data[idProject].memberJoins){
          if(memberId === val.value) {
            memberId = val;
            break;
          };
        }
      }

      this.setState({...this.state, cateTaskId, beginTime: begin, begin, endTime: end, end, description, selectedFrOption: memberId, files})
    }
  }

  formProjectSubmit = () => {
    if(validate(this._inputName, 'str:3:200')){
      let { project } = this.props;
      
      let name = (!!this._inputName) ? this._inputName.value : null;
      let { selectedFrOption, description, files, begin, end, beginTime, endTime, dataError, idProject,
        cateTaskId } = this.state;
      
      project = project.data[idProject] ? project.data[idProject] : null;
      dataError = {};
      
      if(!selectedFrOption || !selectedFrOption.value)
        dataError.selectedFrOption = true;

      if(!idProject) dataError.idProject = true
        
      if(!begin) dataError.begin  = true;
      if(!end) dataError.end      = true;
      if(!beginTime) dataError.beginTime  = true;
      if(!endTime) dataError.endTime      = true;
      
      let beginData = null;
      let endData   = null;

      if(!!begin && !!end && !!beginTime && endTime){
        
        if(!project || begin < project.begin || end > project.end){
          dataError.begin     = true;
          dataError.end       = true;
        }else{
          let dayBegin = convertMDY(begin);
          let timeBegin = new Date(beginTime);

          let time  = `${dayBegin} ${timeBegin.getHours()}:${timeBegin.getMinutes()}:00`;
   
          beginData     = new Date(time).getTime();

          let dayEnd = convertMDY(end);
          let timeEnd = new Date(endTime);

          time  = `${dayEnd} ${timeEnd.getHours()}:${timeEnd.getMinutes()}:00`;
          endData   = new Date(time).getTime();
         
          if(beginData >= endData) {
            dataError.begin  = true;
            dataError.end    = true;
            dataError.beginTime  = true;
            dataError.endTime    = true;
          }
        }
        
      }

      if(isEmpty(dataError)){
        
        let data = {
          name,
          begin: beginData,
          end: endData,
          description,
          projectId: idProject,
          cateTaskId,
          memberId: !!selectedFrOption.value ? selectedFrOption.value : null
        }

        let formData = null;
        if('push' in files && !isEmpty(files)){
          formData = new FormData();
          files.forEach(file => formData.append('file', file));
        }
        
        !!this.props.productOnSubmit && this.props.productOnSubmit(data, formData);

      }
      
      this.setState({dataError});
    }
  }

  setTime = (key) => (val) => {
    val = new Date(val).getTime();
    this.setState({[key]: val});
  }

  fileUpload = (files) => {
    let { dataTask } = this.props;

    files = files.filter(e => {
      return fileConfig.acceptTypeFileProject.indexOf(e.type) !== -1 && fileConfig.maxFilesize >= e.size
    });

    if(!!dataTask && Object.keys(dataTask).length > 0){
      files.length > 0 && !!this.props.fileUpload && this.props.fileUpload(files);
    }else{
      this.setState({files: [...this.state.files, ...files]})
    }

  }

  handelRemoveClick = (idImg) => {
    let { dataTask } = this.props;
    let { files } = this.state;
    if(!!dataTask && Object.keys(dataTask).length > 0){
      files = files.filter((e, i) => i === idImg);
      files.length > 0 && !!this.props.removeFileUpload && this.props.removeFileUpload(files[0].name);
    }else{
      files = files.filter((e, i) => i !== idImg);
      this.setState({files})
    }
    
  }

  descriptionChange = (evt) => {
    let description = evt.editor.getData();
    this.setState({description})
  }

  parseDate = (date) => convertDMY(new Date(date).getTime(), '-');
  
  componentDidUpdate(){
    if(!!this.props.cateTask && !isEmpty(this.props.cateTask.ordered) && !this.state.cateTaskId)
      this.setState({cateTaskId: this.props.cateTask.ordered[0]})

    if(!!this.props.idProject && this.props.idProject !== this.state.idProject)
      this.setState({idProject: this.props.idProject})
  }

  changeCateTask = (id) => () => {
    if(this.state.cateTaskId !== id) this.setState({cateTaskId: id})
  }

  changTime = (key) => e => this.setState({[key]: (!!e && !!e._d ? new Date(e._d).getTime() : null)})

  render() {
    let { dataTask, cateTask, project, idProject } = this.props;
    let { selectedFrOption, dataError, files, cateTaskId, idProject: idProj } = this.state;
    
    if(!project || !cateTask) return null;
    const optionsFr = [];

    if(!!project.data[idProj] && !!project.data[idProj].memberJoins){
      for(let va of project.data[idProj].memberJoins)
        optionsFr.push(va);
    }

    const optionsProject = [];
    for(let id of project.ordered){
      if(!!idProject) {
        optionsProject.push({text: project.data[idProject].name, value: idProject})
        break;
      }
      optionsProject.push({text: project.data[id].name, value: id})
    }

    return (
      <form className="form-horizontal new-lg-form formSubmit p-r-15" method="post" ref={e => this._formSubmit = e} onSubmit={ this.onSubmitFormLogin } name="myform" noValidate >
        <div className="form-group">
          <div className="col-xs-12">
            <label>Name task</label>
            <input defaultValue={!!dataTask && dataTask.name ? dataTask.name : ""} ref={e => this._inputName = e} className="form-control" id="name" name="name" placeholder="Name task" />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-6">
            <label>Select project</label>
            <SelectOP
              className = {dataError.idProject ? 'error' : ''}
              disabled  = { idProject ? true : false }
              options   = { optionsProject } />
          </div>
          <div className="col-xs-6">
            <label>Member join</label>
            <Select
              className = {!!dataError.selectedFrOption ? 'bd-danger' : ''}
              value     = { selectedFrOption }
              isMulti   = { false }
              onChange  = { va => this.setState({selectedFrOption: va}) }
              options   = { optionsFr }
            />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <ul className="nav nav-tabs tabs customtab">
              {
                !!cateTask && !!cateTask.ordered && cateTask.ordered.length > 0 && cateTask.ordered.map((e, i) => {
                  return (
                    <li onClick={ this.changeCateTask(e) } key={ i } style={{width: `${100 / cateTask.ordered.length}%`}} className={`tab br text-center ${e === cateTaskId ? 'active': ''}`}>
                      <Link style={{padding: '5px'}} to={`#`} data-toggle="tab">
                        <span className="m-r-5"> <i className={cateTask.data[e] ? cateTask.data[e].icon : ""} /></span> 
                        <span className="hidden-xs">{cateTask.data[e] ? cateTask.data[e].name : ""}</span>
                      </Link>
                    </li>
                  )
                })
              }
              
            </ul>
          </div>
        </div>

        <div className="form-group">
          <div className={`col-xs-4 ${!!dataError.begin ? 'error-more' : ''}`}>
            <label>Begin day</label>
            <DayPicker
              ref         = { e => this.test = e }
              placeholder={`${ dataTask && dataTask.begin ? convertDMY(dataTask.begin, '-') : 'DD-MM-YYY'}`}
              onDayChange = { this.setTime('begin') }
              formatDate  = { this.parseDate } />
          </div>
          <div className={`col-xs-2 ${!!dataError.beginTime ? 'error-more' : ''}`}>
            <label>Begin time</label>
            <TimePicker
              placeholder = {`${ dataTask && dataTask.begin ? convertHM(dataTask.begin, '-') : 'HH:MM'}`}
              onChange={ this.changTime('beginTime')} />
          </div>

          <div className={`col-xs-4 ${!!dataError.end ? 'error-more' : ''}`}>
            <label>End day</label>
            <DayPicker
              placeholder={`${ dataTask && dataTask.end ? convertDMY(dataTask.end, '-') : 'DD-MM-YYY'}`}
              onDayChange = { this.setTime('end') }
              formatDate  = { this.parseDate } />
          </div>

          <div className={`col-xs-2 ${!!dataError.endTime ? 'error-more' : ''}`}>
            <label>End time</label>
            <TimePicker
              placeholder={`${ dataTask && dataTask.begin ? convertHM(dataTask.end, '-') : 'HH:MM'}`}
              onChange={ this.changTime('endTime')} />
          </div>

        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Description</label>
            <CKEditor
              content={this.state.description} 
              events={{
                change: this.descriptionChange
              }} />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>File attachments</label>
            <Dropzone
              minSize       = { 0 }
              maxSize       = { fileConfig.maxFilesize }
              onDrop        = { e => this.fileUpload(e) } >
              
            </Dropzone>
              {  
                'push' in files && !isEmpty(files)
                ? <ItemFile handelRemoveClick={this.handelRemoveClick} files = { files } />
                : null
              }
          </div>
        </div>
        <div className="form-group m-t-20">
          <div className="col-xs-12">
            <button 
              type      = "button"
              onClick   = { this.formProjectSubmit }
              className = "btn-outline btn-flat btn btn-info fcbtn btn-1b btn-lg text-uppercase waves-effect waves-light">Submit</button>
            {
              !!this.props.homeCancel && (
                <button 
                  type      = "button"
                  onClick   = { this.props.homeCancel }
                  className = "m-l-15 btn-outline btn-flat btn btn-danger fcbtn btn-1b btn-lg text-uppercase waves-effect waves-light">Cancel</button>
              )
            }
          </div>
        </div>

      </form>
    );
  }
}

export default Form;