import * as constant from './constants';

const initialState = {
  data        : {},
  messagetab  : false,
  isWorking   : false,
  error       : null
};

let reducer = (state = initialState, action) => {
  switch (action.type) {
    case constant.RESET:
      return {...initialState};
    
    case constant.FETCH_STARTED:
      return {
        ...state,
        isWorking : true,
        error     : null
      };
    case constant.FETCH_FAILED:
      return {
        ...state,
        isWorking : false,
        error     : action.payload
      };
    case constant.FETCH_FINISHED: {
      let data = {...state.data };

      let list = action.payload;
      let { data: dataM, id } = list;

      if(!!data[id]) data[id] = [...data[id], ...dataM]
      else data[id] = [...dataM];
      
      return {
        ...state,
        data,
        isWorking: false,
        error: null
      };
    }
    case constant.FETCH_FINISHED_ALL:
    {
      let data = action.payload;
      return {
        ...state,
        data,
        isWorking: false,
        error: null
      };
    }
    default:
      break;
  };
  return state;
};

export default reducer;