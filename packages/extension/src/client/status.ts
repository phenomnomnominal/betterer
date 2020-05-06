import { NotificationType, LanguageClient, State } from 'vscode-languageclient';
import { window, StatusBarAlignment, StatusBarItem } from 'vscode';

import { EXTENSION_NAME } from '../constants';
import { getAlwaysShowStatus } from './settings';
import { COMMAND_NAMES } from './commands/names';
import { error } from './logger';
import { SERVER_PROCESS_ENDED, SERVER_PROCESS_SHUT_DOWN } from './error-messages';

const SERVER_RUNNING = `${EXTENSION_NAME} is running.`;
const SERVER_STOPPED = `${EXTENSION_NAME} stopped.`;

export const enum Status {
  ok = 1,
  warn = 2,
  error = 3,
  exit = 4
}

interface StatusParams {
  state: Status;
}

const StatusNotification = new NotificationType<StatusParams, void>(`${EXTENSION_NAME}/status`);

const ExitCalled = new NotificationType<[number, string], void>(`${EXTENSION_NAME}/exitCalled`);

export class BettererStatus {
  private _status = Status.ok;
  private _serverRunning = false;

  private readonly _statusBarItem: StatusBarItem;

  constructor(client: LanguageClient) {
    this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 0);
    this._statusBarItem.text = EXTENSION_NAME;
    this._statusBarItem.command = COMMAND_NAMES.showOutput;
    this._updateStatusBarVisibility();

    this._initEvents(client);
  }

  public get hasExited(): boolean {
    return this._status === Status.exit;
  }

  public dispose(): void {
    this._statusBarItem.dispose();
  }

  private async _initEvents(client: LanguageClient): Promise<void> {
    client.onDidChangeState((event) => {
      if (event.newState === State.Running) {
        client.info(this._start());
      } else if (event.newState === State.Stopped) {
        client.info(this._stop());
      }
    });

    await client.onReady();

    client.onNotification(StatusNotification, (params) => this.update(params.state));
    client.onNotification(ExitCalled, (params) => {
      this._exit();
      const [code, message] = params;
      client.error(SERVER_PROCESS_ENDED(code), message, true);
      error(SERVER_PROCESS_SHUT_DOWN);
    });
  }

  private _start(): string {
    this._statusBarItem.tooltip = SERVER_RUNNING;
    this._serverRunning = true;
    this._updateStatusBarVisibility();
    return SERVER_RUNNING;
  }

  private _stop(): string {
    this._statusBarItem.tooltip = SERVER_STOPPED;
    this._serverRunning = false;
    this._updateStatusBarVisibility();
    return SERVER_STOPPED;
  }

  private _exit(): void {
    this._status = Status.exit;
  }

  public update(status: Status): void {
    this._status = status;
    switch (status) {
      case Status.warn:
        this._statusBarItem.text = `$(alert) ${EXTENSION_NAME}`;
        break;
      case Status.error:
        this._statusBarItem.text = `$(issue-opened) ${EXTENSION_NAME}`;
        break;
      default:
        this._statusBarItem.text = EXTENSION_NAME;
        break;
    }
    this._updateStatusBarVisibility();
  }

  private _showStatusBarItem(show: boolean): void {
    if (show) {
      this._statusBarItem.show();
    } else {
      this._statusBarItem.hide();
    }
  }

  private _updateStatusBarVisibility(): void {
    this._showStatusBarItem((this._serverRunning && this._status !== Status.ok) || getAlwaysShowStatus());
  }
}
