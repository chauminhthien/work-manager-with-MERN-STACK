import { combineReducers } from 'redux';

import { reducer as friends } from './friends';

const reducer = combineReducers({
  friends
});

export default reducer;