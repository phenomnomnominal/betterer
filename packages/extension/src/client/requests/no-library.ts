import { Uri, workspace, ExtensionContext } from 'vscode';
import { RequestType, LanguageClient } from 'vscode-languageclient';

import {
  BETTERER_LIBRARY_NOT_INSTALLED_DETAILS,
  BETTERER_LIBRARY_NOT_INSTALLED,
  BETTERER_OUTPUT_CHANNEL
} from '../error-messages';
import { info } from '../logger';
import { BettererRequestParams } from './types';
import { getNoLibraryState } from './state';

export const BettererNoLibraryRequest = new RequestType<BettererRequestParams, void, void, void>('betterer/noLibrary');

export async function noLibrary(
  client: LanguageClient,
  context: ExtensionContext,
  params: BettererRequestParams
): Promise<void> {
  const uri = Uri.parse(params.source.uri);
  const workspaceFolder = workspace.getWorkspaceFolder(uri);
  if (!workspaceFolder) {
    return;
  }
  const alreadyShown = getNoLibraryState(context, uri);
  if (!alreadyShown) {
    client.info(BETTERER_LIBRARY_NOT_INSTALLED_DETAILS(workspaceFolder));
    const item = await info(BETTERER_LIBRARY_NOT_INSTALLED, {
      title: BETTERER_OUTPUT_CHANNEL
    });
    if (item) {
      client.outputChannel.show(true);
    }
  }
}
