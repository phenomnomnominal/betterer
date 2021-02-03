import { WorkspaceFolder, workspace } from 'vscode';

import { EXTENSION_NAME } from '../../constants';
import { DISABLE_COMMAND_REQUIRES_WORKSPACE, ALREADY_DISABLED } from '../error-messages';
import { error, info } from '../logger';
import { getEnabled, disable } from '../settings';
import { pickFolder } from './folder-picker';

export async function disableBetterer(): Promise<void> {
  const { workspaceFolders } = workspace;
  if (!workspaceFolders) {
    void error(DISABLE_COMMAND_REQUIRES_WORKSPACE);
    return;
  }

  const enabledFolders = workspaceFolders.filter((folder) => getEnabled(folder));
  if (enabledFolders.length === 0) {
    void info(ALREADY_DISABLED(workspaceFolders));
    return;
  }

  let folder: WorkspaceFolder | null = null;
  if (enabledFolders.length === 1) {
    [folder] = enabledFolders;
  } else {
    folder = await pickFolder(enabledFolders, `Select a workspace folder to disable ${EXTENSION_NAME} in`);
  }

  if (!folder) {
    return;
  }

  disable(folder);
  return;
}
