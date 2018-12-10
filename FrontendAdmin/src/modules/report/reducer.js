import { combineReducers } from 'redux';

import { reducer as project } from './project';
import { reducer as task } from './task';
import { reducer as login } from './login';

const reducer = combineReducers({
  project,
  task,
  login
});

export default reducer;