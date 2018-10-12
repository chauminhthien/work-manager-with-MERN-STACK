// @flow
import * as constant from './constants';

const initialState: DistrictState = {
  data: {},
  ordered: [],
  isWorking: false
};

let reducer = (state: DistrictState = initialState, action: Action): DistrictState => {
  switch (action.type) {
    case constant.RESET:
      return { ...initialState };

    case constant.FETCH_STARTED:
      return {
        ...state,
        isWorking: true
      };
    case constant.CHECK_FRIEND_ONL:
      {
        let dataOnl = action.payload;
        let data = {...state.data };
        for(let i in data) data[i].online = false;

        for(let id of dataOnl) if(!!data[id]) data[id].online = true;
        
        return {
          ...state,
          data
        };
      }
    case constant.FETCH_FAILED:
      return {
        ...state,
        isWorking: false
      };

    case constant.FETCH_FINISHED:
    {
      let data = { ...state.data }
      let list = action.payload;
      let newData = { };
      let set = new Set(state.ordered);
      list.forEach((item) => {
        newData[item.id] = !!data[item.id] ? {...data[item.id], ...item} : item;
        set.add(item.id);
      });
      let newOrdered = [ ...set.keys() ];

      return {
        data: { ...state.data, ...newData },
        ordered: newOrdered,
        isWorking: false
      };
    }

    default:
    break;
  }

  return state;
};

export default reducer;