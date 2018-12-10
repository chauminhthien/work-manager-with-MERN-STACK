// @flow

import * as base from './base';

const TASK_BASE = `${ base.API_BASE }/tasks`;

export const get = (filter, skip, limit, where) => {
  filter  = filter  || {};
  where   = where   || {};
  skip    = skip    || 0;
  limit   = limit   || 0;
  
  let filters = {
    ...filter,
    skip,
    limit,
    where
  };
  
  let url = `${ TASK_BASE }?filter=${ JSON.stringify(filters)}`;
  return base.get(url, 200)
    .then(obj => {
      return obj;
    });
}

export const create = (data) => {
  return base.post(TASK_BASE, data, 200)
  .then(obj => {
    return obj;
  });
}

export const uploadFile = (file, id) => {
  let url = `${ TASK_BASE }/upload/${id}`;
  return base.upload(url, file, 200)
    .then(obj => {
      return obj;
    });
}

export const removeFile = (name, id) => {
  let url = `${ TASK_BASE }/removeFile/${id}`;
  return base.post(url, {name}, 200)
    .then(obj => {
      return {data: obj.data.status, error: obj.error};
    });
}

export const getTaskScheduler = () => {
  let url = `${ TASK_BASE }/getTaskScheduler`;
  return base.get(url, 200)
    .then(obj => {
      return obj;
    });
}

export const updateById = (id, data) => {
  let url = `${TASK_BASE}/${id}`;
  return base.patch(url, data, 200)
    .then(obj => {
      return obj;
    });
}
 