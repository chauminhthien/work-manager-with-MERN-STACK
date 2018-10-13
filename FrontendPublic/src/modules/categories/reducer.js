import { combineReducers } from 'redux';

import { reducer as friends } from './friends';
import { reducer as logs } from './logs';
import { reducer as messages } from './messages';

const reducer = combineReducers({
  friends,
  logs,
  messages
});

export default reducer;