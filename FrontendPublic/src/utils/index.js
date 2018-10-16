import * as localStorage from './localStorage';
import * as sessionStorage from './sessionStorage';

import * as user from './api/users';
import * as email from './api/email';
import * as groupUser from './api/groupUser';
import * as logs from './api/logs';
import * as chatting from './api/chatting';
import * as project from './api/project';
import * as messages from './api/messages';

export const api = {
  user,
  email,
  groupUser,
  logs,
  chatting,
  project,
  messages
}

export { localStorage, sessionStorage };