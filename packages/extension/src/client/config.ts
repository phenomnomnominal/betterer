import { Uri, workspace, WorkspaceConfiguration } from 'vscode';

export type PackageManager = 'npm' | 'pnpm' | 'yarn';

export function getEnabled(item: { uri: Uri }): boolean {
  return getConfig(item).get('enable', true);
}

export function enable(item: { uri: Uri }): void {
  updateEnabled(item, true);
}

export function disable(item: { uri: Uri }): void {
  updateEnabled(item, false);
}

export function getDebug(): boolean {
  return getConfig().get('debug', false);
}

export function getPackageManager(item: { uri: Uri }): PackageManager {
  return getConfig(item).get('packageManager', 'npm');
}

export function getRuntime(): string {
  return getConfig().get('runtime', '');
}

function updateEnabled(item: { uri: Uri }, value: boolean): void {
  getConfig(item).update('enable', value);
}

function getConfig(item?: { uri: Uri }): WorkspaceConfiguration {
  return workspace.getConfiguration('betterer', item?.uri);
}
