import * as localStorage from './localStorage';
import * as sessionStorage from './sessionStorage';

import * as user from './api/users';
import * as email from './api/email';
import * as groupUser from './api/groupUser';
import * as channel from './api/channel';
import * as chatting from './api/chatting';

export const api = {
  user,
  email,
  groupUser,
  channel,
  chatting
}

export { localStorage, sessionStorage };