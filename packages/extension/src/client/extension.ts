import { workspace, commands, ExtensionContext } from 'vscode';
import { LanguageClient, CloseAction, ErrorAction } from 'vscode-languageclient';

import { EXTENSION_NAME } from '../constants';
import { disableBetterer, enableBetterer, initBetterer, COMMAND_NAMES } from './commands';
import { CLIENT_START_FAILED, SERVER_START_FAILED } from './error-messages';
import { getClientOptions, getServerOptions } from './options';
import { error } from './logger';
import { NoConfigRequest, NoLibraryRequest, noConfig, noLibrary } from './requests';
import { getEnabled } from './settings';
import { BettererStatus } from './status';

export function activate(context: ExtensionContext): void {
  let activated = false;

  const configurationListener = workspace.onDidChangeConfiguration(configurationChanged);
  function configurationChanged(): void {
    if (activated) {
      return;
    }
    workspace.workspaceFolders?.some(folder => {
      if (getEnabled(folder)) {
        configurationListener.dispose();
        activated = true;
        realActivate(context);
      }
      return activated;
    });
  }

  context.subscriptions.push(
    commands.registerCommand(COMMAND_NAMES.disable, disableBetterer),
    commands.registerCommand(COMMAND_NAMES.enable, enableBetterer),
    commands.registerCommand(COMMAND_NAMES.init, initBetterer)
  );

  configurationChanged();
}

async function realActivate(context: ExtensionContext): Promise<void> {
  try {
    const client = new LanguageClient(
      EXTENSION_NAME,
      getServerOptions(context),
      getClientOptions({
        initFailed(error: Error): boolean {
          client.error(SERVER_START_FAILED, error);
          return false;
        },
        error: (error, message, count): ErrorAction => {
          return errorHandler.error(error, message, count);
        },
        closed: (): CloseAction => {
          if (status.hasExited) {
            return CloseAction.DoNotRestart;
          }
          return errorHandler.closed();
        },
      })
    );

    const status = new BettererStatus(client);
    const errorHandler = client.createDefaultErrorHandler(); const started = client.start();

    await client.onReady();

    client.onRequest(NoConfigRequest, (params) => noConfig(client, status, params));
    client.onRequest(NoLibraryRequest, (params) => noLibrary(client, context, params));

    context.subscriptions.push(
      commands.registerCommand(COMMAND_NAMES.showOutput, () => client.outputChannel.show()),
      started,
      status
    );
  } catch {
    error(CLIENT_START_FAILED);
  }
}
