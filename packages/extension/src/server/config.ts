import { WorkspaceConfiguration } from 'vscode';
import { RemoteWorkspace } from 'vscode-languageserver';

export type PackageManager = 'npm' | 'pnpm' | 'yarn';

export async function getEnabled(workspace: RemoteWorkspace, uri: string): Promise<boolean> {
  const config = await getConfig(workspace, uri);
  return !!config.enable;
}

export async function getPackageManager(workspace: RemoteWorkspace, uri: string): Promise<PackageManager> {
  const config = await getConfig(workspace, uri);
  return config.packageManager;
}

async function getConfig(workspace: RemoteWorkspace, uri: string): Promise<WorkspaceConfiguration> {
  return workspace.getConfiguration({ scopeUri: uri, section: '' });
}
