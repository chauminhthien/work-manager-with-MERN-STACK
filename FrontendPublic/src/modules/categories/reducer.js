import { combineReducers } from 'redux';

import { reducer as friends } from './friends';
import { reducer as logs } from './logs';
import { reducer as messages } from './messages';
import { reducer as cateTask } from './cateTask';

const reducer = combineReducers({
  friends,
  logs,
  messages,
  cateTask
});

export default reducer;