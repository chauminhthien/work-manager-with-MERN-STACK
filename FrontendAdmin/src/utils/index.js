import * as localStorage from './localStorage';
import * as sessionStorage from './sessionStorage';

import * as user from './api/users';
import * as email from './api/email';
import * as groupUser from './api/groupUser';
import * as cateTask from './api/cateTask';

export const api = {
  user,
  email,
  groupUser,
  cateTask
}

export { localStorage, sessionStorage };