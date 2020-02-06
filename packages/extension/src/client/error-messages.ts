import { WorkspaceFolder } from 'vscode';

import { EXTENSION_NAME } from '../constants';
import { PackageManager } from './config';

const NAME = EXTENSION_NAME;
const DEFAULT_CONFIG_FILE = `.${NAME}.ts`;

const COMMAND_REQUIRES_WORKSPACE = `if VS Code is opened on a workspace folder.`;

export const CREATE_CONFIG_COMMAND_REQUIRES_WORKSPACE = `A ${NAME} configuration can only be generated ${COMMAND_REQUIRES_WORKSPACE}`;
export const DISABLE_COMMAND_REQUIRES_WORKSPACE = `${NAME} can only be disabled ${COMMAND_REQUIRES_WORKSPACE}`;
export const ENABLE_COMMAND_REQUIRES_WORKSPACE = `${NAME} can only be enabled ${COMMAND_REQUIRES_WORKSPACE}`;

export const ALREADY_ENABLED = (workspaceFolders: Array<WorkspaceFolder>): string =>
  `${NAME} is already enabled in ${workspaceFolders.length === 1 ? 'the workspace' : 'all workspaces'}.`;

export const ALREADY_DISABLED = (workspaceFolders: Array<WorkspaceFolder>): string =>
  `${NAME} is already disabled in ${workspaceFolders.length === 1 ? 'the workspace' : 'all workspaces'}.`;

export const ALREADY_CONFIGURED = (workspaceFolders: Array<WorkspaceFolder>): string =>
  workspaceFolders.length === 1 ? `The workspace already uses ${NAME}.` : `All workspaces already use ${NAME}.`;

export const NO_BETTERER_CONFIGURATION = (workspaceFolder: WorkspaceFolder): string => `
No ${NAME} configuration (e.g. ${DEFAULT_CONFIG_FILE}) found for workspace: ${workspaceFolder.name}
The workspace will not be validated. Consider executing the 'Create ${NAME} config' command to add ${NAME} to the workspace.
Alternatively you can disable ${NAME} by executing the 'Disable ${NAME}' command.
`;

const LOCAL_INSTALL_COMMANDS = {
  npm: 'npm install betterer -D',
  pnpm: 'pnpm install betterer -D',
  yarn: 'yarn add betterer -D'
};

export const NO_BETTERER_INSTALLED = (packageManager: PackageManager, workspaceFolder: WorkspaceFolder): string => {
  const { name } = workspaceFolder;
  const isNpm = packageManager === 'npm';
  const installCommand = LOCAL_INSTALL_COMMANDS[packageManager];
  return `
Failed to load betterer.

To use betterer please install @betterer/cli by running ${installCommand} in the workspace folder ${name}.
You need to reopen the workspace after installing betterer.

${isNpm ? 'If you are using yarn or pnpm set the setting `betterer.packageManager` to either "yarn or "pnpm"' : ''}
Alternatively you can disable betterer for the workspace folder ${name} by executing the 'Disable betterer' command.
`;
};

export const COULDNT_START_CLIENT = `The ${NAME} extension couldn't be started. See the '${NAME}' output channel for details.`;
export const COULDNT_START_SERVER = `The ${NAME} server couldn't be started. See the '${NAME}' output channel for details.`;
