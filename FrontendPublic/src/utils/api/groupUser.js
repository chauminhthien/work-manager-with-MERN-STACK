// @flow

import * as base from './base';

const GROUP_USER = `${ base.API_BASE }/groupUsers`;

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
  
  let url = `${ GROUP_USER }?filter=${ JSON.stringify(filters)}`;
  return base.get(url, 200)
    .then(obj => {
      return obj;
    });
}


export const updateById = (data, id) => {
  let url = `${GROUP_USER}/${id}`;
  return base.patch(url, data, 200)
    .then(obj => {
      return obj;
    });
}