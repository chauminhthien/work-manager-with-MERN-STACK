// @flow

import * as base from './base';

const PROJECT_BASE = `${ base.API_BASE }/projects`;

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
  
  let url = `${ PROJECT_BASE }?filter=${ JSON.stringify(filters)}`;
  return base.get(url, 200)
    .then(obj => {
      return obj;
    });
}

export const create = (data) => {
  return base.post(PROJECT_BASE, data, 200)
  .then(obj => {
    return obj;
  });
}

export const uploadFile = (file, id) => {
  let url = `${ PROJECT_BASE }/upload/${id}`;
  return base.upload(url, file, 200)
    .then(obj => {
      return {data: obj.data.status, error: obj.error};
    });
}

export const removeFile = (name, id) => {
  let url = `${ PROJECT_BASE }/removeFile/${id}`;
  return base.post(url, {name}, 200)
    .then(obj => {
      return {data: obj.data.status, error: obj.error};
    });
}

export const updateById = (id, data) => {
  let url = `${PROJECT_BASE}/${id}`;
  return base.patch(url, data, 200)
    .then(obj => {
      return obj;
    });
}
 