// @flow

import { combineReducers } from 'redux';
import { reducer as session } from 'modules/session';
import { reducer as breadcrumb } from 'screens/modules/breadcrumb';
import { reducer as profile } from 'modules/account';
import { reducer as categories } from 'modules/categories';
import { reducer as chatting } from 'modules/chatting';
import { reducer as project } from 'modules/project';
import { reducer as task } from 'modules/task';

const reducer = combineReducers({
  session,
  breadcrumb,
  categories,
  profile,
  chatting,
  project,
  task
});

export default reducer;