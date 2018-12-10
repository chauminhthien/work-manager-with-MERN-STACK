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

export const fetchMoreFinished = (data) => {
  return {
    type: constant.FETCH_MORE_FINISHED,
    payload: data
  };
}

export const fetchAll = (filter?, skip?, limit?, where?) => {

  return (dispatch: (action: Action) =>void) => {
    dispatch(fetchStarted());
    return api.task.get(filter, skip, limit, where)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        if(res.data.length > 0) dispatch(fetchFinished(res.data.reverse()));
        return res.data;
      })
      .catch(err => {
        dispatch(fetchFailed(err));
      });
  };
};

export const fetchMore = (filter?, skip?, limit?, where?) => {
  return (dispatch: (action: Action) =>void) => {
    dispatch(fetchStarted());
    api.task.get(filter, skip, limit, where)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        if(res.data.length > 0) dispatch(fetchFinished(res.data.reverse()));
        return res.data;
      })
      .catch(err => {
        dispatch(fetchFailed(err));
      });
  };
};

export const create = (data) => {
  return (dispatch: (action) => void) => {
    return api.task.create(data)
      .then(obj => {
        if(obj.error)
          dispatch(fetchFailed(obj.error));
        if(obj.data)
          dispatch(fetchFinished([obj.data]));
        return obj;
      });
  };
};

export const uploadFile = (file, id) => {
  return (dispatch: (action) => void) => {
    return api.task.uploadFile(file, id)
      .then(obj => { 
        if(!!obj.data)
          dispatch(fetchFinished([obj.data]))
        else dispatch(fetchFailed(obj.error))
        return obj
      });
  }
}

export const removeFile = (name, id) => {
  return (dispatch: (action) => void) => {
    return api.task.removeFile(name, id)
      .then(obj => {
        if(!!obj.data)
          dispatch(fetchFinished([obj.data]))
        else dispatch(fetchFailed(obj.error))
        return obj
      });
  }
}

export const updateById = (id, data) => { 
  return (dispatch: (action) => void) => {
    dispatch(fetchStarted());
    return api.task.updateById(id, data)
      .then(obj => {
        if(!!obj.data)
          dispatch(fetchFinished([obj.data]))
        else dispatch(fetchFailed(obj.error));
        return obj
      });
  }
}