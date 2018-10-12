import React, { Component } from 'react';

import ChatBox from './ChatBox';

import{ isEmpty } from 'utils/functions';

class ListScreenChat extends Component {

  render() {
    let { friends, listScreenChat, chatting, chattingActions, profile } = this.props;

    if(!friends || !listScreenChat || isEmpty(listScreenChat) || isEmpty(friends.data)) return null;

    let dataFriends = friends.data;

    return (
      <div className="windows-wrapper">
        <div className="container">
          <div className="ChatTabsPagelet">
            <ul className="windowsChat" id="windowsChat">
              {
                listScreenChat.map((e, i) => {
        
                  return (
                    <ChatBox 
                      key               = { i }
                      chatting          = { chatting }
                      chattingActions   = { chattingActions }
                      onChatting        = { this.props.onChatting }
                      removeFriendClick = { this.props.removeFriendClick }
                      profile           = { profile }
                      dataFriends       = { dataFriends[e] } />
                  )
                })
              }
              
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default ListScreenChat;