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

    case constant.FETCH_FAILED:
      return {
        ...state,
        isWorking: false
      };

    case constant.FETCH_FINISHED:
    {
      let list = action.payload;
      let newData = { };
      list.forEach((item) => {
        if(!!state.data[item.id]) {
          state.data[item.id] = item;
          newData = {...state.data}
        }else {
          if(item.parentId === "null")
            newData = {[item.id]: item, ...newData, ...state.data};
          else{
            let tam = state.data[item.parentId];
        
            tam.children = !!tam && !!tam.children ? tam.children : [];
            
            let fl = true;
            for(let v of tam.children){
              if(v.id.toString() === item.id.toString()) {
                fl = false;
                break;
              }
            }

            if(!!fl) tam.children.push(item)

            state.data[tam.id] = tam;
            newData = {...state.data}
          }
        }
      });
      let newOrdered = [ ...Object.keys(newData) ];

      return {
        data: { ...newData },
        ordered: newOrdered,
        isWorking: false
      };
    }
    case constant.FETCH_MORE_FINISHED: {
      let list = action.payload;
      let newData = { ...state.data };
      list.forEach((item) => {
        newData[item.id] = item;
      });
      
      let newOrdered = [ ...Object.keys(newData) ];
      return {
        data: {...newData },
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