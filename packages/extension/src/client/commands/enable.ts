import { WorkspaceFolder, workspace } from 'vscode';

import { EXTENSION_NAME } from '../../constants';
import { ALREADY_ENABLED, ENABLE_COMMAND_REQUIRES_WORKSPACE } from '../error-messages';
import { error, info } from '../logger';
import { enable, getEnabled } from '../settings';
import { pickFolder } from './folder-picker';

export async function enableBetterer(): Promise<void> {
  const { workspaceFolders } = workspace;
  if (!workspaceFolders) {
    void error(ENABLE_COMMAND_REQUIRES_WORKSPACE);
    return;
  }

  const disabledFolders = workspaceFolders.filter((folder) => !getEnabled(folder));
  if (disabledFolders.length === 0) {
    void info(ALREADY_ENABLED(workspaceFolders));
    return;
  }

  let folder: WorkspaceFolder | null = null;
  if (disabledFolders.length === 1) {
    [folder] = disabledFolders;
  } else {
    folder = await pickFolder(disabledFolders, `Select a workspace folder to enable ${EXTENSION_NAME} in:`);
  }

  if (!folder) {
    return;
  }
  enable(folder);
  return;
}
