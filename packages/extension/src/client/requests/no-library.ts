import { Uri, workspace, ExtensionContext } from 'vscode';
import { RequestType, TextDocumentIdentifier, LanguageClient } from 'vscode-languageclient';

import { BETTERER_LIBRARY_NOT_INSTALLED } from '../error-messages';
import { info } from '../logger';

type NoLibraryParams = {
  source: TextDocumentIdentifier;
};
type NoLibraryResult = {};

export const NoLibraryRequest = new RequestType<NoLibraryParams, NoLibraryResult, void, void>(
  'betterer/noLibrary'
);

export async function noLibrary(
  client: LanguageClient,
  context: ExtensionContext,
  params: NoLibraryParams
): Promise<NoLibraryResult> {
  const { workspaces } = getNoLibraryState(context);
  const uri = Uri.parse(params.source.uri);
  const workspaceFolder = workspace.getWorkspaceFolder(uri);
  if (workspaceFolder) {
    client.info(BETTERER_LIBRARY_NOT_INSTALLED(workspaceFolder));
    const workspaceUri = workspaceFolder.uri.toString();
    if (!workspaces[workspaceUri]) {
      workspaces[workspaceUri] = true;
      updateNoLibraryState(context, { workspaces });
      const item = await info(`Failed to load betterer. See the output for more information.`, {
        title: 'Go to output',
      });
      if (item) {
        client.outputChannel.show(true);
      }
    }
  }
  return {};
}

const NO_LIBRARY_STATE_KEY = 'noLibraryMessageShown';

type Workspaces = Record<string, boolean>;
type NoLibraryState = {
  workspaces: Workspaces;
};

function getNoLibraryState(context: ExtensionContext): NoLibraryState {
  return context.globalState.get<NoLibraryState>(NO_LIBRARY_STATE_KEY, { workspaces: {} });
}

function updateNoLibraryState(context: ExtensionContext, value: NoLibraryState): void {
  context.globalState.update(NO_LIBRARY_STATE_KEY, value);
}
