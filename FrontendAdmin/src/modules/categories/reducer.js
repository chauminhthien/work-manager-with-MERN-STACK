import { combineReducers } from 'redux';

import { reducer as channel } from './channel';

const reducer = combineReducers({
  channel
});

export default reducer;