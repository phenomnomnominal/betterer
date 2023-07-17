import type { Connection, TextDocumentChangeEvent, TextDocuments } from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';

import debounce from 'lodash.debounce';

import { info } from './console.js';
import { BettererValidator } from './validator.js';

const VALIDATE_TIMEOUT = 100;

export class BettererValidationQueue {
  private _queue = new Map<TextDocument, number>();
  private _validating: Promise<void> | null = null;
  private _validator: BettererValidator;

  constructor(connection: Connection, documents: TextDocuments<TextDocument>) {
    this._validator = new BettererValidator(connection, documents);
    this._trigger = debounce(this._trigger.bind(this), VALIDATE_TIMEOUT, { leading: true, trailing: true });
  }

  public addToQueue(event: TextDocumentChangeEvent<TextDocument>): void {
    info(`Server: Adding "${event.document.uri}" to validation queue at ${new Date().toISOString()}`);
    if (!this._queue.has(event.document)) {
      this._queue.set(event.document, event.document.version);
    } else {
      info(`Server: "${event.document.uri}" is already in the validation queue.`);
    }
    this._trigger();
  }

  public removeFromQueue(event: TextDocumentChangeEvent<TextDocument>): void {
    info(`Server: Removing "${event.document.uri}" from validation queue at ${new Date().toISOString()}`);
    this._queue.delete(event.document);
  }

  private _trigger(): void {
    void (async () => {
      if (this._validating) {
        info(`Server: waiting for previous validation run to finish:`);
        await this._validating;
      }

      this._validating = this._processQueue();
      await this._validating;
      this._validating = null;
    })();
  }

  private async _processQueue(): Promise<void> {
    info(`Server: Processing queue at ${new Date().toISOString()}`);
    const documents = Array.from(this._queue.keys());

    this._queue = new Map();

    if (documents.length === 0) {
      info(`Server: Queue empty, nothing to do.`);
      return;
    }

    await this._validateDocuments(Array.from(documents));
  }

  private async _validateDocuments(documents: Array<TextDocument>): Promise<void> {
    documents.forEach((document) => {
      info(`Server: Validating document "${document.uri}".`);
    });
    try {
      await this._validator.validate(documents);
    } catch {
      //
    }
  }
}
