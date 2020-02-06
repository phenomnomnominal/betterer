import * as path from 'path';
import { ExtensionContext, workspace } from 'vscode';
import {
  ServerOptions,
  TransportKind,
  LanguageClientOptions,
  RevealOutputChannelOn,
  InitializationFailedHandler,
  ErrorHandler
} from 'vscode-languageclient';

import { EXTENSION_NAME } from '../constants';
import { getDebug, getRuntime } from './config';

type Env = Record<string, string | number | boolean>;

export function getServerOptions(context: ExtensionContext): ServerOptions {
  const serverModule = context.asAbsolutePath(path.join('dist', 'server', 'server.js'));

  let env: Env = {};
  if (getDebug()) {
    env = {
      DEBUG: `${EXTENSION_NAME}:*,-${EXTENSION_NAME}:code-path`
    };
  }
  const runtime = getRuntime();
  const cwd = process.cwd();
  return {
    run: { module: serverModule, transport: TransportKind.ipc, runtime, options: { cwd, env } },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      runtime,
      options: { execArgv: ['--nolazy', '--inspect=6060'], cwd: process.cwd(), env }
    }
  };
}

export type ClientErrorHandlers = {
  closed: ErrorHandler['closed'];
  error: ErrorHandler['error'];
  init: InitializationFailedHandler;
};

export function getClientOptions(errorHandlers: ClientErrorHandlers): LanguageClientOptions {
  const { init, error, closed } = errorHandlers;
  return {
    documentSelector: [{ scheme: 'file' }],
    diagnosticCollectionName: EXTENSION_NAME,
    revealOutputChannelOn: RevealOutputChannelOn.Never,
    synchronize: {
      fileEvents: [
        workspace.createFileSystemWatcher('**/.bettere{r.js,r.ts}'),
        workspace.createFileSystemWatcher('**/package.json')
      ]
    },
    initializationFailedHandler: init,
    errorHandler: { error, closed }
  };
}
