import type { ExtensionContext } from 'vscode';
import type { ErrorHandler } from 'vscode-languageclient/node';

import assert from 'node:assert';
import { commands } from 'vscode';
import { CloseAction, LanguageClient } from 'vscode-languageclient/node';
import { EXTENSION_NAME } from '../constants';
import { COMMAND_NAMES, disableBetterer, enableBetterer, initBetterer } from './commands/index';
import { CLIENT_START_FAILED, SERVER_START_FAILED } from './error-messages';
import { error } from './logger';
import { getClientOptions, getServerOptions } from './options';
import { BettererInvalidConfigRequest, BettererNoLibraryRequest, invalidConfig, noLibrary } from './requests/index';
import { BettererStatusBar } from './status';

export async function activate(context: ExtensionContext): Promise<void> {
  context.subscriptions.push(
    commands.registerCommand(COMMAND_NAMES.disable, disableBetterer),
    commands.registerCommand(COMMAND_NAMES.enable, enableBetterer),
    commands.registerCommand(COMMAND_NAMES.init, initBetterer)
  );

  try {
    let status: BettererStatusBar | null = null;
    let errorHandler: ErrorHandler | null = null;

    const client = new LanguageClient(
      EXTENSION_NAME,
      getServerOptions(context),
      getClientOptions({
        initFailed(error: Error): boolean {
          client.error(SERVER_START_FAILED, error);
          return false;
        },
        error: (error, message, count)  => {
          assert(errorHandler);
          errorHandler.error(error, message, count)
          return errorHandler.error(error, message, count);
        },
        closed: () => {
          assert(status);
          assert(errorHandler);
          if (status.hasExited) {
            return {action: CloseAction.DoNotRestart};
          }
          return errorHandler.closed();
        }
      })
    );
    status = new BettererStatusBar(client);
    errorHandler = client.createDefaultErrorHandler();

    await client.start();

    client.onRequest(BettererInvalidConfigRequest, (params) => invalidConfig(client, context, params));
    client.onRequest(BettererNoLibraryRequest, (params) => noLibrary(client, context, params));

    context.subscriptions.push(
      commands.registerCommand(COMMAND_NAMES.showOutputChannel, () => {
        client.outputChannel.show();
      }),
      status
    );
  } catch {
    void error(CLIENT_START_FAILED);
  }
}
