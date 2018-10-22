import { combineReducers } from 'redux';

import { reducer as cateTask } from './cateTask';

const reducer = combineReducers({
  cateTask
});

export default reducer;