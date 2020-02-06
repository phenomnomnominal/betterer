import { workspace, commands, ExtensionContext } from 'vscode';
import { LanguageClient, CloseAction, ErrorAction } from 'vscode-languageclient';

import { EXTENSION_NAME } from '../constants';
import { getEnabled } from './config';
import { createBettererConfig } from './commands/create-config';
import { disableBetterer } from './commands/disable';
import { enableBetterer } from './commands/enable';
import { noBetterer, NoBettererLibraryRequest } from './requests/no-betterer';
import { noConfig, NoConfigRequest } from './requests/no-config';
import { COULDNT_START_CLIENT, COULDNT_START_SERVER } from './error-messages';
import { getClientOptions, getServerOptions } from './options';
import { error } from './logger';
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
        return;
      }
    });
  }

  context.subscriptions.push(
    commands.registerCommand('betterer.createConfig', createBettererConfig),
    commands.registerCommand('betterer.disable', disableBetterer),
    commands.registerCommand('betterer.enable', enableBetterer)
  );

  configurationChanged();
}

async function realActivate(context: ExtensionContext): Promise<void> {
  try {
    const client = new LanguageClient(
      EXTENSION_NAME,
      getServerOptions(context),
      getClientOptions({
        init(error: Error): boolean {
          client.error(COULDNT_START_SERVER, error);
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
        }
      })
    );

    const status = new BettererStatus(client);
    const errorHandler = client.createDefaultErrorHandler();

    const started = client.start();

    await client.onReady();

    client.onRequest(NoConfigRequest, params => noConfig(client, status, params));
    client.onRequest(NoBettererLibraryRequest, params => noBetterer(client, context, params));

    context.subscriptions.push(
      commands.registerCommand('betterer.showOutputChannel', () => client.outputChannel.show()),
      started,
      status
    );
  } catch {
    error(COULDNT_START_CLIENT);
  }
}
