import { combineReducers } from 'redux';

import { reducer as friends } from './friends';
import { reducer as logs } from './logs';
import { reducer as messages } from './messages';
import { reducer as cateTask } from './cateTask';
import { reducer as comment } from './comment';

const reducer = combineReducers({
  friends,
  logs,
  messages,
  cateTask,
  comment
});

export default reducer;