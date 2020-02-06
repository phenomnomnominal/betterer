import { workspace } from 'vscode';

import { getEnabled, disable } from '../config';
import { DISABLE_COMMAND_REQUIRES_WORKSPACE, ALREADY_DISABLED } from '../error-messages';
import { pickFolder } from '../folder-picker';
import { error, info } from '../logger';

export async function disableBetterer(): Promise<void> {
  const { workspaceFolders } = workspace;
  if (!workspaceFolders) {
    error(DISABLE_COMMAND_REQUIRES_WORKSPACE);
    return;
  }

  const enabledFolders = workspaceFolders.filter(folder => getEnabled(folder));
  if (enabledFolders.length === 0) {
    info(ALREADY_DISABLED(workspaceFolders));
    return;
  }

  const folder = await pickFolder(enabledFolders, 'Select a workspace folder to disable betterer in');
  if (!folder) {
    return;
  }

  disable(folder);
  return;
}
