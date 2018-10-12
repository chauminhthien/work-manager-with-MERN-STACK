import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification, Loading } from 'components';
import { actions as friendActions } from 'modules/categories/friends';
import { actions as chattingActions } from 'modules/chatting';
import{ isEmpty, rmv } from 'utils/functions';
import users                from 'assets/Images/user.jpg';
import './Messagse.css';
import ContentChat from './ContentChat';

class Messagse extends Component {
  _keywordInput = null;

  constructor(props){
    super(props);
    this.state = {
      friendActive  : null,
      keySearch     : null,
      fecth         : true
    }
  }

  componentDidMount(){
    let { profile, friendActions, chattingActions } = this.props;
    let { groupUserID, id } = profile.info;

    friendActions.fetchFriends({
      groupUserID, status: 1, id: {neq: id}
    })
    .then(res => {
      if(!!res && !isEmpty(res)) this.setState({friendActive: res[0]})
      let dateFr = [];
      for(let val of res){
        dateFr.push(val.id);
      }
      if(!isEmpty(dateFr)){
        chattingActions.fetchMessAllFr(dateFr);
      }
    })
    .finally(() => this.setState({fecth: false}))
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

  onChangeKeyword = () => {
    let keySearch = (!!this._keywordInput) ? this._keywordInput.value : "";
  
    if(keySearch.trim().length >= 0 && keySearch.trim().length < 200){
      keySearch = rmv(keySearch);
      this.setState({keySearch});
    }
  }
  
  render() {
    let { profile, friends, chatting } = this.props;
    let { friendActive, keySearch, fecth }    = this.state;
    let fullName = (profile && profile.info) ? `${profile.info.fullname}` : "";
    
    if(friends.isWorking) return <Loading />
    let imgAvatar = profile && profile.info && profile.info.avatar ?  profile.info.avatar : users;

    let { ordered, data } = friends;
    let orderedN = ordered.filter(e => {
      let name = rmv(data[e].fullname ? data[e].fullname : "");
      return (!keySearch || name.indexOf(keySearch) !== -1);
    })

    return (
      <div className="row">
        <div id="frame">
          <div id="sidepanel">
            <div id="profile">
              <div className="wrap">
                <img id="profile-img" src={imgAvatar} className="online" alt="img" />
                <p>{fullName}</p>
              </div>
            </div>
            <div id="search">
              <label ><i className="fa fa-search" aria-hidden="true" /></label>
              <input onChange = { this.onChangeKeyword } ref= { e => this._keywordInput = e} type="text" placeholder="Search contacts..." />
            </div>
            <div id="contacts">
              <Scrollbars>
                <ul>
                  {
                    !!orderedN && !isEmpty(orderedN) && !isEmpty(orderedN)
                    ? (
                      orderedN.map((e, i) => {
                        let img = friends.data[e] && friends.data[e].avatar ? friends.data[e].avatar : users;
                        let len = !!chatting.data[e] ? chatting.data[e].length : 0;
                        let mess = len > 0 ? chatting.data[e][len - 1].message : "No message";
                        
                        return (
                          <li onClick={ () => this.setState({friendActive: friends.data[e]})} key={i} className={`contact ${ friendActive && friendActive.id === e ? 'active': ''}`}>
                            <div className="wrap">
                              <span className={`contact-status ${!!friends.data[e].online ? 'online' : 'off'}`} />
                              <img src={img} alt="img" />
                              <div className="meta">
                                <p className="name">{friends.data[e] ? friends.data[e].fullname : ""}</p>
                                <p className="preview">{mess}</p>
                              </div>
                            </div>
                          </li>
                        )
                      })
                    )
                    : null
                  }
                  
                </ul>
              </Scrollbars>
            </div>
          </div>
          <ContentChat
            onChatting        = { this.onChatting }
            chatting          = { chatting }
            fecth             = { fecth }
            friendActive      = { friendActive } />
        </div>
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

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(Messagse));