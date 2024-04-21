// eslint-disable-next-line import/no-unresolved -- vscode is an implicit dependency for extensions
import type { ExtensionContext } from 'vscode';
import type { CloseHandlerResult, ErrorHandler, ErrorHandlerResult } from 'vscode-languageclient/node';

import assert from 'node:assert';
// eslint-disable-next-line import/no-unresolved -- vscode is an implicit dependency for extensions
import { commands } from 'vscode';
import { CloseAction, LanguageClient } from 'vscode-languageclient/node';
import { EXTENSION_NAME } from '../constants.js';
import { COMMAND_NAMES, disableBetterer, enableBetterer, initBetterer } from './commands/index.js';
import { CLIENT_START_FAILED, SERVER_START_FAILED } from './error-messages.js';
import { error } from './logger.js';
import { getClientOptions, getServerOptions } from './options.js';
import { BettererInvalidConfigRequest, BettererNoLibraryRequest, invalidConfig, noLibrary } from './requests/index.js';
import { BettererStatusBar } from './status.js';

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
        error: async (error, message, count): Promise<ErrorHandlerResult> => {
          assert(errorHandler);
          return await errorHandler.error(error, message, count);
        },
        closed: async (): Promise<CloseHandlerResult> => {
          assert(status);
          assert(errorHandler);
          if (status.hasExited) {
            return { action: CloseAction.DoNotRestart };
          }
          return await errorHandler.closed();
        }
      })
    );

    status = new BettererStatusBar(client);
    errorHandler = client.createDefaultErrorHandler();

    await client.start();

    client.onRequest(BettererInvalidConfigRequest, (params) => invalidConfig(client, context, params));
    client.onRequest(BettererNoLibraryRequest, (params) => noLibrary(client, context, params));

    context.subscriptions.push(
      commands.registerCommand(COMMAND_NAMES.showOutputChannel, () => client.outputChannel.show()),
      status
    );
  } catch {
    void error(CLIENT_START_FAILED);
  }
}
