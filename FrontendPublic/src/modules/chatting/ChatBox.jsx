import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import users        from 'assets/Images/user.jpg';
import{ isEmpty } from 'utils/functions';
import { convertTimeMess } from 'utils/format';

class ChatBox extends Component {
  _element    = null;
  _inputChat  =  null;
  _panelBody  = null;

  constructor(props){
    super(props);
    this.state = {
      show : true,
      fetch : false
    }
  }

  removeFriendClick = (id) => () => !!this.props.removeFriendClick &&  this.props.removeFriendClick(id);

  toggetChatBox = () => this.setState({...this.state, show: !this.state.show})

  componentDidMount(){
    let { chatting, profile, dataFriends, chattingActions } = this.props;
    let { id } = dataFriends;
    
    if(!chatting.data[id]){
      this.setState({fetch: true});
      chattingActions.fetchMess({
        include: [
          {relation: "me", scope: { fields: { avatar: true }}},
          {relation: "friend", scope: { fields: { avatar: true }}},
        ],
        order: "id DESC"
      }, 0, 10,{
        and: [
          {
            or :[
                { idFriend        : profile.info.id },
                { idFriend        : id }
              ]
          },
          {
            or :[
                { idMe        : profile.info.id },
                { idMe        : id }
              ]
          }
        ]
        
      }, id)
      .finally( () => {
        this.setState({fetch: false});
        this.scrollTop();
      });

    }
    this.scrollTop();
    if(!!this._element) this._element.getElementsByTagName('input')[0].focus();
  }

  onKeyPress = (id) => (e) => {
    if(e.key === "Enter"){

      let mess = !!this._inputChat ? this._inputChat.value : "";
      mess = mess.trim();

      if(mess.length > 0){
        
        !!this.props.onChatting && this.props.onChatting({mess, id})
          .then(res => !!res && this.scrollTop());
        this._inputChat.value = null;
      }
    }
  }

  componentDidUpdate(){
    // this.scrollTop();
  }

  scrollTop = (height) => {
    let slimScrollDiv = this._element.getElementsByClassName('panel-body')[0];
    if(!!slimScrollDiv){
      let slimscroll = slimScrollDiv.getElementsByClassName('slimscroll')[0];

      if(!!slimscroll){ 
        height = undefined !== height ? height :  slimscroll.offsetHeight;
        slimScrollDiv.scrollTo(0, height + 70);
      }
    }
  }

  onScroll = (id) => () => {
    if(!!this._panelBody && this._panelBody.scrollTop === 0){
      let { chattingActions, chatting, profile } = this.props;
      
      if(!!chatting.data[id]){
        let skip = chatting.data[id].length;
        this.setState({fetch: true});
        chattingActions.fetchMore({
          include: [
            {relation: "me", scope: { fields: { avatar: true }}},
            {relation: "friend", scope: { fields: { avatar: true }}},
          ],
          order: "id DESC"
        }, skip, 10,{
          and: [
            {
              or :[
                  { idFriend        : profile.info.id },
                  { idFriend        : id }
                ]
            },
            {
              or :[
                  { idMe        : profile.info.id },
                  { idMe        : id }
                ]
            }
          ]
          
        }, id)
        .finally( () => {
          this.setState({fetch: false});
          this.scrollTop(50)
        });
  
      }
    }
  }

  render() {
    let { dataFriends, chatting, profile, siteMess } = this.props;
    let { show, fetch } = this.state;
    
    chatting = chatting.data;

    if(isEmpty(dataFriends)) return null;
    let idMe      = profile.info.id;
    let idFriend  = dataFriends.id;

    return (
      <li id={`li-${dataFriends.id ? dataFriends.id : ""}`} ref={ e => this._element = e } className={`col-md-4 ${!!show && !siteMess ? "" : "off"}`}  >
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="panel panel-themecolor">
            <div  className="panel-heading vertical-middle"> 
              <span onClick={ this.toggetChatBox } > {dataFriends.fullname ? dataFriends.fullname : ""} </span>
              
              <div className="pull-right"> <Link onClick={ this.removeFriendClick(dataFriends.id ? dataFriends.id : "") } className="vertical-middle" to="#" data-perform="panel-dismiss"><i className="ti-close" /></Link> </div>
            </div>
            <div className={`panel-wrapper collapse in ${!!fetch ? 'loading': ''}`} aria-expanded="true" role="dialog">
              <div ref={e => this._panelBody =e } onScroll={ this.onScroll(dataFriends.id) } className="panel-body">
                <div className="chat-box" style={{height: 510}}>
                  <div  className="slimScrollDiv" style={{position: 'relative', overflow: 'hidden', width: 'auto'}}><ul className="chat-list slimscroll" style={{overflow: 'hidden', width: 'auto', height: '100%'}} tabIndex={5005}>
                      {
                        !!chatting[idFriend] && !isEmpty(chatting[idFriend])
                        ? (
                          chatting[idFriend].map( (e, i) => {
                            
                            if(e.idMe === idMe){
                              let imgAvatar = e && e.me && e.me.avatar && e.me.avatar !== "" ?  e.me.avatar : users;
                              return (
                                <li key={i} className="odd">
                                  <div className="chat-image"> <img alt="Female" src={imgAvatar} /> </div>
                                  <div className="chat-body">
                                    <div className="chat-text">
                                      <p>{ e.message ? e.message : ""} </p>
                                      <b>{ e.time ? convertTimeMess(e.time) : ""}</b> 
                                      </div>
                                  </div>
                                </li>
                              )
                            }
                            let imgAvatar = e && e.me && e.me.avatar && e.me.avatar !== "" ?  e.me.avatar : users;
                            return (
                              <li key={i} >
                                <div className="chat-image"> <img alt="male" src={imgAvatar} /> </div>
                                <div className="chat-body">
                                  <div className="chat-text">
                                    <p>{ e.message ? e.message : ""} </p>
                                    <b>{ e.time ? convertTimeMess(e.time) : ""}</b> 
                                  </div>
                                </div>
                              </li>
                            )
                          })
                        )
                        : null
                      }
                      
                    </ul>
                    <div className="slimScrollBar" style={{background: 'rgb(220, 220, 220)', width: 0, position: 'absolute', top: 0, opacity: '0.4', display: 'none', borderRadius: 7, zIndex: 99, right: 1, height: 510}} />
                      <div className="slimScrollRail" style={{width: 0, height: '100%', position: 'absolute', top: 0, display: 'none', borderRadius: 7, background: 'rgb(51, 51, 51)', opacity: '0.2', zIndex: 90, right: 1}} />
                    </div>
                </div>
              </div>
              <div className="panel-footer p-0 p-t-5">
                <div>
                  <div className="col-xs-10 p-r-0 p-l-0">
                    <input ref={ e => this._inputChat = e } onKeyPress={ this.onKeyPress(dataFriends.id) } placeholder="Type your message here" className="chat-box-input p-l-15" defaultValue={""} />
                  </div>
                  <div className="col-xs-2 p-l-0 text-right bg-white">
                    <button className="btn btn-success btn-circle btn-xl" type="button">
                      <i className="fa fa-paper-plane" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default ChatBox;