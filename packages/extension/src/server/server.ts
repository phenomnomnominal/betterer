import {
  createConnection,
  TextDocuments,
  TextDocumentSyncKind,
  DidChangeWatchedFilesNotification,
  DidChangeConfigurationNotification,
  DidChangeWorkspaceFoldersNotification
} from 'vscode-languageserver';
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
  const queueValidate = validationQueue.addNotificationMessage.bind(validationQueue);

  connection.onInitialize(() => {
    documents.listen(connection);
    documents.onDidOpen(queueValidate);
    documents.onDidChangeContent(queueValidate);
    documents.onDidSave(queueValidate);
    documents.onDidClose((event) => {
      connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
    });

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
    connection.client.register(DidChangeConfigurationNotification.type);
    connection.client.register(DidChangeWorkspaceFoldersNotification.type);
  });

  validationQueue.onNotification(
    BettererValidateNotification,
    (document) => {
      validator.single(document);
    },
    (document) => document.version
  );

  connection.listen();

  function environmentChanged(): void {
    documents.all().forEach((document) => validationQueue.addNotificationMessage({ document }));
  }
}

init();
