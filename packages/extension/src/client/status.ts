import { NotificationType, LanguageClient, State } from 'vscode-languageclient';
import { window, StatusBarAlignment, workspace, StatusBarItem } from 'vscode';
import { EXTENSION_NAME } from '../constants';

const SERVER_RUNNING = 'betterer extension is running.';
const SERVER_STOPPED = 'betterer extension stopped.';

export const enum Status {
  ok = 1,
  warn = 2,
  error = 3,
  exit = 4
}

interface StatusParams {
  state: Status;
}

const StatusNotification = new NotificationType<StatusParams, void>('betterer/status');

const ExitCalled = new NotificationType<[number, string], void>('betterer/exitCalled');

export class BettererStatus {
  private _status = Status.ok;
  private _serverRunning = false;

  private readonly _statusBarItem: StatusBarItem;

  constructor(client: LanguageClient) {
    this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 0);
    this._statusBarItem.text = EXTENSION_NAME;
    this._statusBarItem.command = 'betterer.showOutputChannel';
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
    client.onDidChangeState(event => {
      if (event.newState === State.Running) {
        client.info(this._start());
      } else if (event.newState === State.Stopped) {
        client.info(this._stop());
      }
    });

    await client.onReady();
    client.onNotification(StatusNotification, params => this.update(params.state));

    client.onNotification(ExitCalled, params => {
      this._exit();
      const [code, error] = params;
      client.error(
        `Server process exited with code ${code}. This usually indicates a misconfigured betterer setup.`,
        error
      );
      window.showErrorMessage(`betterer server shut down itself. See 'betterer' output channel for details.`);
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
      case Status.ok:
        this._statusBarItem.text = 'betterer';
        break;
      case Status.warn:
        this._statusBarItem.text = '$(alert) betterer';
        break;
      case Status.error:
        this._statusBarItem.text = '$(issue-opened) betterer';
        break;
      default:
        this._statusBarItem.text = 'betterer';
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
    const config = workspace.getConfiguration('betterer');
    this._showStatusBarItem(
      (this._serverRunning && this._status !== Status.ok) || config.get('alwaysShowStatus', true)
    );
  }
}
