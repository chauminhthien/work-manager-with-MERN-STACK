// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Menu } from './modules/menu';
import { Sidebar } from './modules/sidebar';
import { Content } from './modules/content';

import { Loading } from 'components';
import * as sessionActions from 'modules/session/actions';
import { actions as profileActions } from 'modules/account';
import { actions as chattingActions} from 'modules/chatting';
import { actions as messageActions } from 'modules/categories/messages';
import { MenuChat } from 'modules/chatting';
import { getJsonFromSearch } from 'utils/functions';
import 'styles/App.css';

// import io from "socket.io-client";

class DashboardPage extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      idFriendChat : null,
      idNoti       : null
    }

  }

  menuTabChatClick = (id) => this.setState({idFriendChat: id})

  componentWillMount(){
    let { session } = this.props;

    if(session.token && session.token.length === 64){
      let {profileActions} = this.props;
      profileActions.getUserInToken(session.token)
        .then(res => {
          if(res.data == null) this.props.sessionActions.resetSession();
        })
        .catch( () => this.props.sessionActions.resetSession());
    } else this.props.sessionActions.resetSession();
  }

  componentDidUpdate(){
    let { location, messageActions } = this.props;
    let { search } = location;

    if(!!search && search !== ""){
      let param = getJsonFromSearch(search);

      if(!!param && !!param.noti && this.state.idNoti !== param.noti)
        messageActions.updateById(param.noti, {status: 1})
        .finally(() => this.setState({idNoti: param.noti}))
    }
  }
  
  render() {
    let { location, profile } = this.props;
    let { idFriendChat } = this.state;
    if(!profile.info) return <Loading />;
    
    return (
      <React.Fragment >
        <div id="wrapper">
          <Menu menuTabChatClick={ this.menuTabChatClick } />
          <Sidebar location={location} />
          <div id="page-wrapper">
              <div className="container-fluid p-0">
                <Content />
              </div>
          </div>
        </div>
        <MenuChat 
          resetIdFriendChat   = { () => this.setState({idFriendChat: null}) }
          idFriendChat        = { idFriendChat }
          location            = { location } />
      </React.Fragment>
      
    );
  }
};

let mapStateToProps = (state) => {
  let { session, profile } = state;
  return { session, profile };
};

let mapDispatchToProps = (dispatch) => {
  return {
    sessionActions    : bindActionCreators(sessionActions, dispatch),
    profileActions    : bindActionCreators(profileActions, dispatch),
    chattingActions   : bindActionCreators(chattingActions, dispatch),   
    messageActions    : bindActionCreators(messageActions, dispatch),   
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
