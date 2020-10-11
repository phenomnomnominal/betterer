import assert from 'assert';
import { ExtensionContext, commands } from 'vscode';
import { CloseAction, ErrorAction, ErrorHandler, LanguageClient } from 'vscode-languageclient';
import { EXTENSION_NAME } from '../constants';
import { COMMAND_NAMES, disableBetterer, enableBetterer, initBetterer } from './commands';
import { CLIENT_START_FAILED, SERVER_START_FAILED } from './error-messages';
import { error } from './logger';
import { getClientOptions, getServerOptions } from './options';
import { BettererInvalidConfigRequest, BettererNoLibraryRequest, invalidConfig, noLibrary } from './requests';
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
        error: (error, message, count): ErrorAction => {
          assert(errorHandler);
          return errorHandler.error(error, message, count);
        },
        closed: (): CloseAction => {
          assert(status);
          assert(errorHandler);
          if (status.hasExited) {
            return CloseAction.DoNotRestart;
          }
          return errorHandler.closed();
        }
      })
    );
    status = new BettererStatusBar(client);
    errorHandler = client.createDefaultErrorHandler();

    const started = client.start();
    await client.onReady();

    client.onRequest(BettererInvalidConfigRequest, (params) => invalidConfig(client, context, params));
    client.onRequest(BettererNoLibraryRequest, (params) => noLibrary(client, context, params));

    context.subscriptions.push(
      commands.registerCommand(COMMAND_NAMES.showOutputChannel, () => client.outputChannel.show()),
      started,
      status
    );
  } catch {
    void error(CLIENT_START_FAILED);
  }
}
