import * as fs from 'fs';
import * as path from 'path';
import { workspace, window } from 'vscode';

import { CREATE_CONFIG_COMMAND_REQUIRES_WORKSPACE, ALREADY_CONFIGURED } from '../error-messages';
import { pickFolder } from '../folder-picker';
import { error, info } from '../logger';

const CONFIG_FILES = ['.betterer.ts', '.betterer.js'];

export async function createBettererConfig(): Promise<void> {
  const { workspaceFolders } = workspace;
  if (!workspaceFolders) {
    error(CREATE_CONFIG_COMMAND_REQUIRES_WORKSPACE);
    return;
  }

  const foldersWithoutConfig = workspaceFolders.filter(folder =>
    CONFIG_FILES.every(configFile => {
      return !fs.existsSync(path.join(folder.uri.fsPath, configFile));
    })
  );
  if (foldersWithoutConfig.length === 0) {
    info(ALREADY_CONFIGURED(workspaceFolders));
    return;
  }

  const folder = await pickFolder(foldersWithoutConfig, 'Select a workspace folder to initialise betterer in');
  if (!folder) {
    return;
  }

  const terminal = window.createTerminal({ name: `betterer init`, cwd: folder.uri.fsPath });
  terminal.sendText(`npx @betterer/cli init`);
  terminal.show();
}
