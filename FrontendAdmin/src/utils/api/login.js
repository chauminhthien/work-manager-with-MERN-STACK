// @flow

import * as base from './base';

const LOGIN_BASE = `${ base.API_BASE }/logins`;

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
  
  let url = `${ LOGIN_BASE }?filter=${ JSON.stringify(filters)}`;
  return base.get(url, 200)
    .then(obj => {
      return obj;
    });
}

export const getChart = () => {
  let url = `${ LOGIN_BASE }/getChart`;
  return base.get(url, 200)
    .then(obj => {
      return obj;
    });
}