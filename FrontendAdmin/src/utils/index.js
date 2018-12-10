import * as localStorage from './localStorage';
import * as sessionStorage from './sessionStorage';

import * as user from './api/users';
import * as email from './api/email';
import * as groupUser from './api/groupUser';
import * as cateTask from './api/cateTask';
import * as project from './api/project';
import * as task from './api/task';
import * as comment from './api/comment';
import * as login from './api/login';

export const api = {
  user,
  email,
  groupUser,
  cateTask,
  project,
  task,
  comment,
  login
}

export { localStorage, sessionStorage };