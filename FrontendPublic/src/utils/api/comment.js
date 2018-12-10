// @flow

import * as base from './base';

const COMMENT_BASE = `${ base.API_BASE }/comments`;

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
  
  let url = `${ COMMENT_BASE }?filter=${ JSON.stringify(filters)}`;
  return base.get(url, 200)
    .then(obj => {
      return obj;
    });
}

export const create = (data) => {
  return base.post(COMMENT_BASE, data, 200)
  .then(obj => {
    return obj;
  });
}

export const uploadFile = (file, id, parentId = null) => {
  let url = `${ COMMENT_BASE }/upload/${id}/${parentId}`;
  return base.upload(url, file, 200)
    .then(obj => {
      return {data: obj.data.status, error: obj.error};
    });
}

export const removeFile = (name, id) => {
  let url = `${ COMMENT_BASE }/removeFile/${id}`;
  return base.post(url, {name}, 200)
    .then(obj => {
      return {data: obj.data.status, error: obj.error};
    });
}

export const updateById = (id, data) => {
  let url = `${COMMENT_BASE}/${id}`;
  return base.patch(url, data, 200)
    .then(obj => {
      return obj;
    });
}
 