import { workspace, WorkspaceFolder } from 'vscode';

import { EXTENSION_NAME } from '../../constants';
import { ENABLE_COMMAND_REQUIRES_WORKSPACE, ALREADY_ENABLED } from '../error-messages';
import { error, info } from '../logger';
import { getEnabled, enable } from '../settings';
import { pickFolder } from './folder-picker';

export async function enableBetterer(): Promise<void> {
  const { workspaceFolders } = workspace;
  if (!workspaceFolders) {
    error(ENABLE_COMMAND_REQUIRES_WORKSPACE);
    return;
  }

  const disabledFolders = workspaceFolders.filter((folder) => !getEnabled(folder));
  if (disabledFolders.length === 0) {
    info(ALREADY_ENABLED(workspaceFolders));
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
