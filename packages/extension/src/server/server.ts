import {
  DidChangeWatchedFilesNotification,
  DidChangeConfigurationNotification,
  DidChangeWorkspaceFoldersNotification,
  TextDocumentChangeEvent,
  TextDocumentSyncKind,
  TextDocuments,
  createConnection
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { createErrorHandler } from './error-handler';
import { BettererValidateNotification, BettererValidationQueue } from './notifications';
import { initTrace } from './trace';
import { BettererValidator } from './validator';

function init(): void {
  const connection = createConnection();

  initTrace(connection.tracer);
  createErrorHandler(connection);

  connection.console.info(`Betterer server running in node ${process.version}`);

  const validationQueue = new BettererValidationQueue();
  const documents = new TextDocuments(TextDocument);
  const validator = new BettererValidator(connection, documents);

  function clearDiagnostics(event: TextDocumentChangeEvent<TextDocument>): void {
    connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
  }

  function queueValidate(event: TextDocumentChangeEvent<TextDocument>): void {
    validationQueue.addNotificationMessage(event);
  }

  connection.onInitialize(() => {
    documents.listen(connection);
    documents.onDidOpen(queueValidate);
    documents.onDidChangeContent(clearDiagnostics);
    documents.onDidSave(queueValidate);
    documents.onDidClose(clearDiagnostics);

    return {
      capabilities: {
        textDocumentSync: {
          openClose: true,
          change: TextDocumentSyncKind.Incremental,
          willSaveWaitUntil: false,
          save: {
            includeText: false
          }
        }
      }
    };
  });

  connection.onNotification(DidChangeConfigurationNotification.type, environmentChanged);
  connection.onNotification(DidChangeWorkspaceFoldersNotification.type, environmentChanged);
  connection.onNotification(DidChangeWatchedFilesNotification.type, environmentChanged);

  connection.onInitialized(() => {
    void connection.client.register(DidChangeConfigurationNotification.type);
    void connection.client.register(DidChangeWorkspaceFoldersNotification.type);
  });

  validationQueue.onNotification(
    BettererValidateNotification,
    (document) => {
      void validator.single(document);
    },
    (document) => document.version
  );

  connection.listen();

  function environmentChanged(): void {
    documents.all().forEach((document) => validationQueue.addNotificationMessage({ document }));
  }
}

init();
