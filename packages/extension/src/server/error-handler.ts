import { IConnection, NotificationType } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Status } from './status';

const ExitCalled = new NotificationType<[number, string], void>('betterer/exitCalled');

export type ErrorHandler = (error: Error, document: TextDocument) => Status;

export function createErrorHandler(connection: IConnection): ErrorHandler {
  const nodeExit = process.exit;
  process.exit = ((code?: number): void => {
    const stack = new Error('stack');
    connection.sendNotification(ExitCalled, [code ? code : 0, stack.stack]);
    setTimeout(() => nodeExit(code), 1000);
  }) as typeof process.exit;

  process.on('uncaughtException', (error: Error) => {
    let message: string | undefined;
    if (error) {
      if (typeof error.stack === 'string') {
        message = error.stack;
      } else if (typeof error.message === 'string') {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      }

      if (message === undefined || message.length === 0) {
        try {
          message = JSON.stringify(error, undefined, 4);
        } catch (e) {
          // Should not happen.
        }
      }
    }

    // eslint-disable-next-line no-console
    console.error('Uncaught exception received.');
    if (message) {
      // eslint-disable-next-line no-console
      console.error(message);
    }
  });

  return function showErrorMessage(error: Error, document: TextDocument): Status {
    connection.window.showErrorMessage(
      `Betterer: An error occurred while validating document: ${document.uri}. Please see the 'Betterer' output channel for details.`
    );
    if (error.stack) {
      connection.console.error('Betterer stack trace:');
      connection.console.error(error.stack);
    }
    return Status.error;
  };
}
