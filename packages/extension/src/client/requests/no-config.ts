import { LanguageClient, TextDocumentIdentifier, RequestType } from 'vscode-languageclient';
import { Uri, workspace } from 'vscode';

import { NO_BETTERER_CONFIGURATION } from '../error-messages';
import { BettererStatus, Status } from '../status';

type NoConfigParams = {
  document: TextDocumentIdentifier;
};
type NoConfigResult = {};

export const NoConfigRequest = new RequestType<NoConfigParams, NoConfigResult, void, void>('betterer/noConfig');

export function noConfig(client: LanguageClient, status: BettererStatus, params: NoConfigParams): NoConfigResult {
  const workspaceFolder = workspace.getWorkspaceFolder(Uri.parse(params.document.uri));
  if (workspaceFolder) {
    client.warn(NO_BETTERER_CONFIGURATION(workspaceFolder));
  }
  status.update(Status.warn);
  return {};
}
