import type { BettererOptions } from '@betterer/betterer';
import type { RemoteWorkspace } from 'vscode-languageserver/node';

import { promises as fs } from 'node:fs';
import path from 'node:path';

interface BettererExtensionConfig {
  cachePath: string;
  configPath: string;
  enable: boolean;
  filters: Array<string>;
  resultsPath: string;
  tsconfigPath: string;
  debug: boolean;
  debugLogPath: string;
}

export async function getEnabled(workspace: RemoteWorkspace): Promise<boolean> {
  const { enable } = await getExtensionConfig(workspace);
  return !!enable;
}

export async function getDebug(workspace: RemoteWorkspace): Promise<void> {
  const { debug, debugLogPath } = await getExtensionConfig(workspace);
  const value = debug ? '1' : '';
  process.env.BETTERER_DEBUG = value;
  process.env.BETTERER_DEBUG_TIME = value;
  process.env.BETTERER_DEBUG_VALUES = value;
  if (debug && debugLogPath) {
    process.env.BETTERER_DEBUG_LOG = debugLogPath;
  }
}

export async function getBettererOptions(cwd: string, workspace: RemoteWorkspace): Promise<BettererOptions> {
  const { cachePath, configPath, filters, resultsPath, tsconfigPath } = await getExtensionConfig(workspace);
  const config: BettererOptions = {
    cache: true,
    cachePath: path.resolve(cwd, cachePath),
    configPaths: [path.resolve(cwd, configPath)],
    cwd,
    filters,
    resultsPath: path.resolve(cwd, resultsPath),
    silent: true
  };
  if (tsconfigPath !== '') {
    try {
      const absoluteTSConfigPath = path.resolve(cwd, tsconfigPath);
      await fs.readFile(absoluteTSConfigPath);
      config.tsconfigPath = absoluteTSConfigPath;
    } catch {
      // Cannot read `tsconfigPath`
    }
  }
  return config;
}

function getExtensionConfig(workspace: RemoteWorkspace): Promise<BettererExtensionConfig> {
  return workspace.getConfiguration({ section: 'betterer' }) as Promise<BettererExtensionConfig>;
}
