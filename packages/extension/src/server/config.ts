import { BettererOptionsRunner } from '@betterer/betterer';
import { promises as fs } from 'fs';
import path from 'path';
import { RemoteWorkspace } from 'vscode-languageserver/node';

type BettererExtensionConfig = {
  cachePath: string;
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

export async function getBettererConfig(cwd: string, workspace: RemoteWorkspace): Promise<BettererOptionsRunner> {
  const { cachePath, configPath, filters, resultsPath, tsconfigPath } = await getConfig(workspace);
  const config: BettererOptionsRunner = {
    cachePath,
    configPaths: configPath,
    filters,
    resultsPath
  };
  if (tsconfigPath !== '') {
    try {
      await fs.readFile(path.resolve(cwd, tsconfigPath));
      config.tsconfigPath = tsconfigPath;
    } catch {
      // Cannot read `tsconfigPath`
    }
  }
  return config;
}

function getConfig(workspace: RemoteWorkspace): Promise<BettererExtensionConfig> {
  return workspace.getConfiguration({ section: 'betterer' }) as Promise<BettererExtensionConfig>;
}
