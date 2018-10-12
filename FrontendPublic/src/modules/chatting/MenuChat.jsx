import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { RightSidebar, Loading } from 'components';
import ListMember from './ListMember';
import ListScreenChat from './ListScreenChat';

import { actions as friendActions } from 'modules/categories/friends';
import * as chattingActions from './actions';

import io from "socket.io-client";
// 
class MenuChat extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      open            : false,
      listScreenChat  : [],
      arrKey          : null,
      siteMess        : false
    }

    this.socket = io('http://localhost:9100');
  }

  //========================================================

  friendClick = (e) => {
    
    let { friends } = this.props;

    if(!!friends.data[e]){
      let listScreenChat = [...this.state.listScreenChat, e];

      let set = new Set(listScreenChat);
      listScreenChat = [...set.keys()];

      let arrKey = null;

      if(listScreenChat.length >= 3){
        let key = null
        listScreenChat.forEach( (el, i) => {
          if(el === e) key = i;
        });
        
        if(key === 0) arrKey = [listScreenChat[0], listScreenChat[1], listScreenChat[2]];
        else if(key === listScreenChat.length) arrKey = [listScreenChat[key], listScreenChat[key - 1], listScreenChat[key -2]];
        else arrKey = [listScreenChat[key + 1], listScreenChat[key], listScreenChat[key - 1]];

      }
      this.setState({...this.state, listScreenChat, arrKey})
    }
  }

  removeFriendClick = (e) => {
    let listScreenChat = [...this.state.listScreenChat];

    listScreenChat = listScreenChat.filter(el => e !== el);

    this.setState({...this.state, listScreenChat})
  }

  onChatting = (data) => {
    let { mess, id } = data;
    let { chattingActions, profile } = this.props;

    let dt = {
      idMe      : profile.info.id,
      message   : mess,
      idFriend  : id,
      status    : 0,
      time      : Date.now()
    }
    return chattingActions.create(dt)
    .then((res) => !!res.data);
  }
  
  //=========================================================
  componentDidMount(){
    let { profile, friends, friendActions, chattingActions } = this.props;
    let { groupUserID, id } = profile.info;

    if(friends.ordered.length === 0 ) friendActions.fetchFriends({
      groupUserID, status: 1, id: {neq: id}
    })

    this.socket.on('connect', () => {
      this.socket.emit('setSocketId', profile.info.id);

      this.socket.on('CHATTING_NEW_MESS', (data) => {
        
        let { listScreenChat, siteMess }  = this.state;
        let { idMe } = data;

        chattingActions.fetchFinished({data: [data], id: idMe})
        if(!siteMess && !listScreenChat[idMe]){
          listScreenChat.push(idMe);
          let set = new Set(listScreenChat);
          listScreenChat = [...set.keys()];
          this.setState({...this.state, listScreenChat})
        }
      })

      this.socket.on('SERVER_SEND_UERS_ONLINE', (data) => {
        
        'push' in data && friendActions.checkFriendOnline(data);
      })
    });

  }

  componentDidUpdate(){
    let { pathname } = this.props.location;
    let { siteMess } = this.state;
    let site = (pathname === '/messagse') ? true : false;

    if(siteMess !== site) this.setState({...this.state, siteMess: site});
  }

  render() {
    let { open, listScreenChat, arrKey, siteMess } = this.state;
    let { profile, friends, chatting, chattingActions } = this.props;

    if(friends.isWorking) return <Loading />

    return (
      <div>
        <RightSidebar 
          title     = "List member"
          children  = {<ListMember
            friendClick = { this.friendClick }
            friends     = { friends } />}
          style     = {{width: '200px', overflow: 'hidden'}}
          className = "chatList"
          onClose   = { () => this.setState({open: false})}
          open      = { open } />
        <div onClick={() => this.setState({open: true})} id="iconChat"><i className="fa fa-comment"></i></div>
        <ListScreenChat
          friends           = { friends }
          onChatting        = { this.onChatting }
          removeFriendClick = { this.removeFriendClick }
          arrKey            = { arrKey }
          chatting          = { chatting }
          profile           = { profile }
          siteMess          = { siteMess }
          chattingActions   = { chattingActions }
          listScreenChat    = { listScreenChat } />
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { profile, chatting } = state;
  let { friends } = state.categories;

  return { profile, friends, chatting };
};

let mapDispatchToProps = (dispatch) => {
  return {
    friendActions       : bindActionCreators(friendActions, dispatch),
    chattingActions     : bindActionCreators(chattingActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuChat);