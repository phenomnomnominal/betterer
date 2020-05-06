import { IConnection, NotificationHandler, NotificationType, TextDocumentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

type ValidationNotificationType = NotificationType<TextDocument, void>;
export const ValidateNotification = new NotificationType<TextDocument, void>('betterer/validate');

type ValidationNotificationHandler = NotificationHandler<TextDocument>;

type ValidationNotification = {
  method: string;
  document: TextDocument;
  documentVersion: number | undefined;
};

interface VersionProvider {
  (params: TextDocument): number | undefined;
}

export class ValidationQueue {
  private _queue: Array<ValidationNotification>;
  private _notificationHandlers: Map<
    string,
    { handler: ValidationNotificationHandler; versionProvider: VersionProvider }
  >;
  private _timer: NodeJS.Immediate | null = null;

  constructor(private _connection: IConnection) {
    this._queue = [];
    this._notificationHandlers = new Map();
  }

  public registerNotification(
    type: ValidationNotificationType,
    handler: ValidationNotificationHandler,
    versionProvider: (document: TextDocument) => number
  ): void {
    this._connection.onNotification(type, (document) => {
      this._queue.push({
        method: type.method,
        document,
        documentVersion: versionProvider ? versionProvider(document) : undefined
      });
      this._trigger();
    });
    this._notificationHandlers.set(type.method, { handler, versionProvider });
  }

  public addNotificationMessage(event: TextDocumentChangeEvent<TextDocument>): void {
    this._queue.push({
      method: ValidateNotification.method,
      document: event.document,
      documentVersion: event.document.version
    });
    this._trigger();
  }

  public onNotification(
    type: ValidationNotificationType,
    handler: ValidationNotificationHandler,
    versionProvider: (params: TextDocument) => number
  ): void {
    this._notificationHandlers.set(type.method, { handler, versionProvider });
  }

  private _trigger(): void {
    if (this._timer !== null || this._queue.length === 0) {
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
    if (elem === undefined) {
      throw new Error(`No handler registered`);
    }
    if (
      elem.versionProvider &&
      message.documentVersion !== undefined &&
      message.documentVersion !== elem.versionProvider(message.document)
    ) {
      return;
    }
    elem.handler(message.document);
  }
}
