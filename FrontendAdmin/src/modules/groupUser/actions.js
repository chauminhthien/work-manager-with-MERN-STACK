// @flow

import * as constant from './constants';
import { api } from 'utils';

export const reset = ():Action => {
  return {
    type: constant.RESET,
    payload: null
  };
}

export const fetchStarted = ():Action => {
  return {
    type: constant.FETCH_STARTED,
    payload: null
  };
};

export const fetchFailed = (error: any):Action => {
  return {
    type: constant.FETCH_FAILED,
    payload: error
  };
};

export const fetchFinished = (data: any):Action => {
  return {
    type: constant.FETCH_FINISHED,
    payload: data
  };
};

export const fetchAll = (filter?, skip?, limit?, where?) => {
  return (dispatch: (action: Action) =>void) => {
    dispatch(fetchStarted());
    api.groupUser.get(filter, skip, limit, where)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        dispatch(fetchFinished(res.data));
        return res.data;
      })
      .catch(err => {
        dispatch(fetchFailed(err));
      });
  };
};

export const updateById = (id, data) => { 
  return (dispatch: (action) => void) => {
    dispatch(fetchStarted());
    return api.groupUser.updateById(data, id)
      .then(obj => {
        if(!!obj.data)
          dispatch(fetchFinished([obj.data]))
        else dispatch(fetchFailed(obj.error));
        return obj
      });
  }
}