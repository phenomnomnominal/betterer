import assert from 'assert';
import { NotificationHandler, NotificationType, TextDocumentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { BettererValidationNotification, BettererVersionProvider } from './types';

export const BettererValidateNotification = new NotificationType<TextDocument>('betterer/validate');

export class BettererValidationQueue {
  private _queue: Array<BettererValidationNotification> = [];
  private _notificationHandlers = new Map<
    string,
    { handler: NotificationHandler<TextDocument>; versionProvider: BettererVersionProvider }
  >();
  private _timer: NodeJS.Immediate | null = null;

  public addNotificationMessage(event: TextDocumentChangeEvent<TextDocument>): void {
    if (!this._queue.find((item) => item.document === event.document)) {
      this._queue.push({
        method: BettererValidateNotification.method,
        document: event.document,
        documentVersion: event.document.version
      });
    }
    this._trigger();
  }

  public onNotification(
    type: NotificationType<TextDocument>,
    handler: NotificationHandler<TextDocument>,
    versionProvider: (params: TextDocument) => number
  ): void {
    this._notificationHandlers.set(type.method, { handler, versionProvider });
  }

  private _trigger(): void {
    if (this._timer != null || this._queue.length === 0) {
      return;
    }
    this._timer = setImmediate(() => {
      this._timer = null;
      this._processQueue();
      this._trigger();
    });
  }

  private _processQueue(): void {
    const message = this._queue.shift();
    if (!message) {
      return;
    }
    const elem = this._notificationHandlers.get(message.method);
    assert(elem);
    if (message.documentVersion != null && message.documentVersion !== elem.versionProvider?.(message.document)) {
      return;
    }
    elem.handler(message.document);
  }
}
