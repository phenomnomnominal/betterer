import { workspace } from 'vscode';

import { EXTENSION_NAME } from '../../constants';
import { getEnabled, enable } from '../settings';
import { ENABLE_COMMAND_REQUIRES_WORKSPACE, ALREADY_ENABLED } from '../error-messages';
import { pickFolder } from './folder-picker';
import { error, info } from '../logger';

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

  const folder = await pickFolder(disabledFolders, `Select a workspace folder to enable ${EXTENSION_NAME} in:`);
  if (!folder) {
    return;
  }

  enable(folder);
  return;
}
