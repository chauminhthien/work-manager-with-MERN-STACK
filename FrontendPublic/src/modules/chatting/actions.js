import * as constant from './constants';
import { api } from 'utils';

const fetchStarted = () => {
  return {
    type: constant.FETCH_STARTED,
    payload: null
  };
};

export const fetchFinished = (data) => {
  return {
    type: constant.FETCH_FINISHED,
    payload: data
  };
};

const fetchFailed = (error) => {
  return {
    type: constant.FETCH_FAILED,
    payload: error
  };
};

export const fetchFinishedAll = (data) => {
  return {
    type: constant.FETCH_FINISHED_ALL,
    payload: data
  };
}

export const fetchMess = (filter?, skip?, limit?, where?, id) => {  
  return (dispatch: (action) => void) => {
    dispatch(fetchStarted());
    return api.chatting.fetchMess(filter, skip, limit, where)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        dispatch(fetchFinished({data: res.data.reverse(), id}));
        return res.data;
      })
      .catch(err => {
        dispatch(fetchFailed(err));
      });
  };
};

export const create = (data) => {
  return (dispatch: (action) => void) => {
    dispatch(fetchStarted());
    return api.chatting.create(data)
      .then(obj => {
        if(obj.error)
          dispatch(fetchFailed(obj.error));
        if(obj.data)
          dispatch(fetchFinished({data: [obj.data], id: data.idFriend}));
        return obj;
      })
  };
};


export const fetchMessAllFr = (dataFr) => {
  return (dispatch: (action) => void) => {
    dispatch(fetchStarted());
    return api.chatting.fetchMessAllFr(dataFr)
      .then(obj => {
        if(obj.error)
          dispatch(fetchFailed(obj.error));
        if(obj.data)
          dispatch(fetchFinishedAll(obj.data));
        return obj;
      })
  };
}
