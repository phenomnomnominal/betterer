import { WorkspaceConfiguration } from 'vscode';
import { RemoteWorkspace } from 'vscode-languageserver';
import { BettererConfigPartial } from '@betterer/betterer';

export async function getEnabled(workspace: RemoteWorkspace): Promise<boolean> {
  const { enable } = await getConfig(workspace);
  return !!enable;
}

export async function getBettererConfig(workspace: RemoteWorkspace): Promise<BettererConfigPartial> {
  const { configPath, filters, resultsPath, tsconfigPath, update } = await getConfig(workspace);
  return {
    configPaths: configPath,
    filters,
    resultsPath,
    tsconfigPath: tsconfigPath !== '' ? tsconfigPath : null,
    update: !!update
  };
}

function getConfig(workspace: RemoteWorkspace): Promise<WorkspaceConfiguration> {
  return workspace.getConfiguration({ section: 'betterer' });
}
