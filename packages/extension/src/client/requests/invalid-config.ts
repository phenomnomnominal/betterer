import type { LanguageClient } from 'vscode-languageclient/node';
import type { ExtensionContext } from 'vscode';

import { RequestType } from 'vscode-languageclient/node';
import { Uri, workspace } from 'vscode';

import {
  BETTERER_CONFIG_FILE_INVALID,
  BETTERER_CONFIG_FILE_INVALID_DETAILS,
  BETTERER_OUTPUT_CHANNEL
} from '../error-messages';
import { info } from '../logger';
import type { BettererRequestParams } from './types';
import { getInvalidConfigState } from './state';

export const BettererInvalidConfigRequest = new RequestType<BettererRequestParams, void, void>(
  'betterer/invalidConfig'
);

export async function invalidConfig(
  client: LanguageClient,
  context: ExtensionContext,
  params: BettererRequestParams
): Promise<void> {
  const uri = Uri.parse(params.source.uri);
  const workspaceFolder = workspace.getWorkspaceFolder(uri);
  if (!workspaceFolder) {
    return;
  }
  const alreadyShown = getInvalidConfigState(context, uri);
  if (!alreadyShown) {
    client.info(BETTERER_CONFIG_FILE_INVALID_DETAILS(workspaceFolder));
    const item = await info(BETTERER_CONFIG_FILE_INVALID, {
      title: BETTERER_OUTPUT_CHANNEL
    });
    if (item) {
      client.outputChannel.show(true);
    }
  }
}
