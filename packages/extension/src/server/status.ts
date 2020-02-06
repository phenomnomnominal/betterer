import { NotificationType } from 'vscode-languageserver';

export const enum Status {
  ok = 1,
  warn = 2,
  error = 3
}

type StatusParams = {
  state: Status;
};

export const StatusNotification = new NotificationType<StatusParams, void>('betterer/status');
