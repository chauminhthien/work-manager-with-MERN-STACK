// @flow

import * as base from './base';

const CATE_TASK_USER = `${ base.API_BASE }/cateTasks`;

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
  
  let url = `${ CATE_TASK_USER }?filter=${ JSON.stringify(filters)}`;
  return base.get(url, 200)
    .then(obj => {
      return obj;
    });
}


export const updateById = (id, data) => {
  let url = `${CATE_TASK_USER}/${id}`;
  return base.patch(url, data, 200)
    .then(obj => {
      return obj;
    });
}

export const create = (data) => {
  return base.post(CATE_TASK_USER, data, 200)
  .then(obj => {
    return obj;
  });
}

export const del = (id) =>{
  return base.del(`${CATE_TASK_USER}/`+id, 200)
    .then(res => {
      return res;
    });
}
