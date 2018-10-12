// @flow

import * as base from './base';

const CHATTING_BASE = `${ base.API_BASE }/chattings`;

export const fetchMess = (filter, skip, limit, where) => {
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
  
  let url = `${ CHATTING_BASE }?filter=${ JSON.stringify(filters)}`;
  
  return base.get(url, 200)
    .then(obj => {
      return obj;
    });
}

export const fetchMessAllFr = (data) => {
  let url = `${CHATTING_BASE}/fetchMessAllFr`;

  return base.post(url, {data}, 200)
  .then(obj => {
    return obj;
  });
}

export const updateUserById = (data, id) => {
  let url = `${CHATTING_BASE}/${id}`;
  return base.patch(url, data, 200)
    .then(obj => {
      return obj;
    });
}

export const create = (data) => {
  return base.post(CHATTING_BASE, data, 200)
  .then(obj => {
    return obj;
  });
}

// export const updateById = (data, id) => {
//   let url = `${USER}/updateUserByID?id=${id}`;
//   return base.post(url, data, 200)
//     .then(obj => {
//       return obj;
//     });
// }
