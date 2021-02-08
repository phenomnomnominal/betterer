import { RemoteWorkspace } from 'vscode-languageserver/node';
import { BettererBaseConfigPartial } from '@betterer/betterer';

type BettererExtensionConfig = {
  configPath: string;
  enable: boolean;
  filters: Array<string>;
  resultsPath: string;
  tsconfigPath: string;
  debug: boolean;
  debugLogPath: string;
};

export async function getEnabled(workspace: RemoteWorkspace): Promise<boolean> {
  const { enable } = await getConfig(workspace);
  return !!enable;
}

export async function getDebug(workspace: RemoteWorkspace): Promise<void> {
  const { debug, debugLogPath } = await getConfig(workspace);
  const value = debug ? '1' : '';
  process.env.BETTERER_DEBUG = value;
  process.env.BETTERER_DEBUG_TIME = value;
  process.env.BETTERER_DEBUG_VALUES = value;
  if (debug && debugLogPath) {
    process.env.BETTERER_DEBUG_LOG = debugLogPath;
  }
}

export async function getBettererConfig(workspace: RemoteWorkspace): Promise<BettererBaseConfigPartial> {
  const { configPath, filters, resultsPath, tsconfigPath } = await getConfig(workspace);
  const config: BettererBaseConfigPartial = {
    configPaths: configPath,
    filters,
    resultsPath
  };
  if (tsconfigPath !== '') {
    config.tsconfigPath = tsconfigPath;
  }
  return config;
}

function getConfig(workspace: RemoteWorkspace): Promise<BettererExtensionConfig> {
  return workspace.getConfiguration({ section: 'betterer' }) as Promise<BettererExtensionConfig>;
}
