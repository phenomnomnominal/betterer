import * as path from 'path';
import { ExtensionContext, workspace } from 'vscode';
import {
  ErrorHandler,
  InitializationFailedHandler,
  LanguageClientOptions,
  RevealOutputChannelOn,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';

import { EXTENSION_NAME } from '../constants';
import { getRuntime } from './settings';

export function getServerOptions(context: ExtensionContext): ServerOptions {
  const serverModule = context.asAbsolutePath(path.join('dist', 'server', 'server.js'));

  const runtime = getRuntime();
  const cwd = process.cwd();
  return {
    run: {
      module: serverModule,
      transport: TransportKind.ipc,
      runtime,
      options: { cwd }
    },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      runtime,
      options: { execArgv: ['--nolazy', '--inspect=6060'], cwd }
    }
  };
}

export type ClientErrorHandlers = {
  closed: ErrorHandler['closed'];
  error: ErrorHandler['error'];
  initFailed: InitializationFailedHandler;
};

export function getClientOptions(errorHandlers: ClientErrorHandlers): LanguageClientOptions {
  const { initFailed, error, closed } = errorHandlers;
  return {
    documentSelector: [{ scheme: 'file' }],
    diagnosticCollectionName: EXTENSION_NAME,
    revealOutputChannelOn: RevealOutputChannelOn.Error,
    synchronize: {
      fileEvents: [
        workspace.createFileSystemWatcher('**/.bettere{r.js,r.ts}'),
        workspace.createFileSystemWatcher('**/package.json')
      ]
    },
    initializationFailedHandler: initFailed,
    errorHandler: { error, closed }
  };
}
