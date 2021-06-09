import { Connection, TextDocumentChangeEvent, TextDocuments } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { info } from '../console';

import { BettererValidator } from '../validator';
import { BettererValidationNotification } from './types';

export class BettererValidationQueue {
  private _queue: Array<BettererValidationNotification> = [];
  private _timer: NodeJS.Immediate | null = null;
  private _validator: BettererValidator;

  constructor(connection: Connection, documents: TextDocuments<TextDocument>) {
    this._validator = new BettererValidator(connection, documents);
  }

  public addNotificationMessage(event: TextDocumentChangeEvent<TextDocument>): void {
    info(`Server: Queueing validation for "${event.document.uri}".`);
    if (!this._queue.find((item) => item.document === event.document)) {
      this._queue.push({
        document: event.document,
        documentVersion: event.document.version
      });
    }
    this._trigger();
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
    const documents = this._queue
      .filter((item) => item.document.version === item.documentVersion)
      .map((item) => item.document);
    this._validateDocuments(documents);
    this._queue.length = 0;
  }

  private _validateDocuments(documents: Array<TextDocument>) {
    documents.forEach((document) => {
      info(`Server: Validating document "${document.uri}".`);
    });
    void this._validator.validate(documents);
  }
}
