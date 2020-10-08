import {
  DidChangeConfigurationNotification,
  DidChangeWatchedFilesNotification,
  DidChangeWorkspaceFoldersNotification,
  TextDocumentChangeEvent,
  TextDocumentSyncKind,
  TextDocuments,
  createConnection
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { info, initConsole } from './console';
import { createErrorHandler } from './error-handler';
import { BettererValidateNotification, BettererValidationQueue } from './notifications';
import { initTrace } from './trace';
import { BettererValidator } from './validator';

function init(): void {
  const connection = createConnection();

  initTrace(connection.tracer);
  initConsole(connection.console);
  createErrorHandler(connection);

  info(`Server: Betterer server running in node ${process.version}`);

  const validationQueue = new BettererValidationQueue();
  const documents = new TextDocuments(TextDocument);
  const validator = new BettererValidator(connection, documents);

  function clearDiagnostics(event: TextDocumentChangeEvent<TextDocument>): void {
    info(`Server: Clearing diagnostics for "${event.document.uri}".`);
    connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
  }

  function queueValidate(event: TextDocumentChangeEvent<TextDocument>): void {
    info(`Server: Queueing validation for "${event.document.uri}".`);
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
      info(`Server: Validating document "${document.uri}".`);
      void validator.validate(document);
    },
    (document) => document.version
  );

  connection.listen();

  function environmentChanged(): void {
    info('Server: Environment changed, revalidating all documents:');
    documents.all().forEach((document) => queueValidate({ document }));
  }
}

init();
