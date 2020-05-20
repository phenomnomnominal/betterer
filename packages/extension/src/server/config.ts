import { WorkspaceConfiguration } from 'vscode';
import { RemoteWorkspace } from 'vscode-languageserver';

export async function getEnabled(workspace: RemoteWorkspace): Promise<boolean> {
  const { enable } = await getConfig(workspace);
  return !!enable;
}

function getConfig(workspace: RemoteWorkspace): Promise<WorkspaceConfiguration> {
  return workspace.getConfiguration({ section: 'betterer' });
}
