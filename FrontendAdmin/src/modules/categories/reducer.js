import { combineReducers } from 'redux';

import { reducer as cateTask } from './cateTask';
import { reducer as comment } from './comment';

const reducer = combineReducers({
  cateTask,
  comment
});

export default reducer;