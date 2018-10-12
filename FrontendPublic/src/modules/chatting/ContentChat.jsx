import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import users                from 'assets/Images/user.jpg';

class ContentChat extends Component {
  _inputChat  = null;
  _element    = null;

  onKeyPress = (id) => (e) => {
    if(e.key === "Enter"){

      let mess = !!this._inputChat ? this._inputChat.value : "";
      mess = mess.trim();

      if(mess.length > 1) this.sendMessage(mess, id);
    }
  }

  sendMessage = (mess, id) => {

    !!this.props.onChatting && this.props.onChatting({mess, id})
      .then(res => !!res && this.scrollTop());
    this._inputChat.value = null;
  }

  handelClickSend = (id) => () => {
    let mess = !!this._inputChat ? this._inputChat.value : "";
    mess = mess.trim();

    if(mess.length > 0) this.sendMessage(mess, id);
  }

  componentDidUpdate(){
    this.scrollTop();
  }
  componentDidMount(){
    !!this._inputChat && this._inputChat.focus();
  }

  scrollTop = () => {
    let { chatting, friendActive } = this.props;
    let dataMess = !!friendActive && !!chatting ? chatting.data[friendActive.id]: [];

    if(!!this._element && !!dataMess){
      let divContent = this._element.getElementsByTagName('div')[0];
      if(!!divContent){
        let list = divContent.getElementsByTagName('li')[0];
        let he = !!list ? list.offsetHeight : 0;

        he = he*(dataMess.length);
        if(he > 415)
          divContent.getElementsByTagName('div')[0].scrollTo(0, he);
      }
    }
  }
  
  render() {
    let { friendActive, chatting, fecth } = this.props;
    if(!friendActive || !chatting) return null;

    let fullName = (friendActive) ? `${friendActive.fullname}` : "";
    
    let imgAvatar = friendActive && friendActive.avatar ?  friendActive.avatar : users;
    let dataMess = friendActive && chatting ? chatting.data[friendActive.id]: [];

    return (
      <div className={`content ${!!fecth ? 'loading' : ''}`}>
        <div className="contact-profile">
          <img src={imgAvatar} alt="img" />
          <p>{fullName}</p>
          <div className="social-media">
            <i className="fa fa-facebook" aria-hidden="true" />
            <i className="fa fa-twitter" aria-hidden="true" />
            <i className="fa fa-instagram" aria-hidden="true" />
          </div>
        </div>
        <div ref={e => this._element = e} className="messages">
          <Scrollbars style={{height: '75vh'}}>
            <ul>
              {
                !!dataMess && 'push' in dataMess && dataMess.map((e, i) => {

                  let imgAvatar = e && e.me && e.me.avatar && e.me.avatar !== "" ?  e.me.avatar : users;

                  if(e.idFriend === friendActive.id){
                    return (
                      <li key={i} className="replies">
                        <img src={imgAvatar} alt="img" />
                        <p>{e.message ? e.message : ""}</p>
                      </li>
                    )
                  }

                  return (
                    <li key={i} className="sent">
                      <img src={imgAvatar} alt="img" />
                      <p>{e.message ? e.message : ""}</p>
                    </li>
                  )
                })
              }
            </ul>
          </Scrollbars>
        </div>
        <div className="message-input">
          <div className="wrap">
            <input ref={ e => this._inputChat = e } onKeyPress={ this.onKeyPress(friendActive.id ? friendActive.id : null) } type="text" placeholder="Write your message..." />
            <button onClick={ this.handelClickSend(friendActive.id) } className="submit"><i className="fa fa-paper-plane" aria-hidden="true" /></button>
          </div>
        </div>
      </div>
    );
  }
}

export default ContentChat;