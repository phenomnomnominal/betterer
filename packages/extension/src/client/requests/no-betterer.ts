import { Uri, workspace, ExtensionContext } from 'vscode';
import { RequestType, TextDocumentIdentifier, LanguageClient } from 'vscode-languageclient';

import { getPackageManager } from '../config';
import { NO_BETTERER_INSTALLED } from '../error-messages';
import { info } from '../logger';
import { getNoBettererState, updateNoBettererState } from '../state';

type NoBettererLibraryParams = {
  source: TextDocumentIdentifier;
};
type NoBettererLibraryResult = {};

export const NoBettererLibraryRequest = new RequestType<NoBettererLibraryParams, NoBettererLibraryResult, void, void>(
  'betterer/noLibrary'
);

export async function noBetterer(
  client: LanguageClient,
  context: ExtensionContext,
  params: NoBettererLibraryParams
): Promise<NoBettererLibraryResult> {
  const workspaces = getNoBettererState(context);
  const uri = Uri.parse(params.source.uri);
  const workspaceFolder = workspace.getWorkspaceFolder(uri);
  const packageManager = getPackageManager({ uri });
  if (workspaceFolder) {
    client.info(NO_BETTERER_INSTALLED(packageManager, workspaceFolder));
    const workspaceUri = workspaceFolder.uri.toString();
    if (!workspaces[workspaceUri]) {
      workspaces[workspaceUri] = true;
      updateNoBettererState(context, { workspaces });
      const item = await info(`Failed to load betterer. See the output for more information.`, {
        title: 'Go to output'
      });
      if (item) {
        client.outputChannel.show(true);
      }
    }
  }
  return {};
}
