import { Connection, TextDocumentChangeEvent, TextDocuments } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { info } from './console';

import { BettererValidator } from './validator';

type BettererValidationNotification = {
  document: TextDocument;
  documentVersion: number | undefined;
};

export class BettererValidationQueue {
  private _queue: Array<BettererValidationNotification> = [];
  private _validating: Promise<void> | null = null;
  private _validator: BettererValidator;

  constructor(connection: Connection, documents: TextDocuments<TextDocument>) {
    this._validator = new BettererValidator(connection, documents);
  }

  public addToQueue(event: TextDocumentChangeEvent<TextDocument>): void {
    info(`Server: Adding "${event.document.uri}" to validation queue at ${Date.now().toString()}`);
    if (!this._queue.find((item) => item.document === event.document)) {
      this._queue.push({
        document: event.document,
        documentVersion: event.document.version
      });
    }
    void this._trigger();
  }

  public removeFromQueue(event: TextDocumentChangeEvent<TextDocument>): void {
    info(`Server: Removing "${event.document.uri}" from validation queue at ${Date.now().toString()}`);
    const index = this._queue.findIndex((item) => item.document === event.document);
    if (index > -1) {
      this._queue.splice(index, 1);
    }
  }

  private async _trigger(): Promise<void> {
    if (this._validating) {
      await this._validating;
    }
    this._validating = this._processQueue();
    await this._validating;
  }

  private async _processQueue(): Promise<void> {
    info(`Server: Processing queue at ${Date.now().toString()}`);
    const documents = new Set(this._queue.map((item) => item.document));

    this._queue.length = 0;

    if (documents.size === 0) {
      info(`Server: Queue empty, nothing to do.`);
      return;
    }

    await this._validateDocuments(Array.from(documents));
  }

  private async _validateDocuments(documents: Array<TextDocument>): Promise<void> {
    documents.forEach((document) => {
      info(`Server: Validating document "${document.uri}".`);
    });
    await this._validator.validate(documents);
    this._validating = null;
    void this._trigger();
  }
}
