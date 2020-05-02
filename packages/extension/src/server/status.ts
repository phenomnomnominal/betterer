import { NotificationType } from 'vscode-languageserver';

import { EXTENSION_NAME } from '../constants';

export const enum Status {
  ok = 1,
  warn = 2,
  error = 3,
  exit = 4,
}

type StatusParams = {
  state: Status;
};

export const StatusNotification = new NotificationType<StatusParams, void>(`${EXTENSION_NAME}/status`);
