import type { BettererOptionsRunner } from '@betterer/betterer';
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
}

export async function getEnabled(workspace: RemoteWorkspace): Promise<boolean> {
  const { enable } = await getExtensionConfig(workspace);
  return !!enable;
}

export async function getBettererOptions(cwd: string, workspace: RemoteWorkspace): Promise<BettererOptionsRunner> {
  const { cachePath, configPath, filters, resultsPath, tsconfigPath } = await getExtensionConfig(workspace);
  const options: BettererOptionsRunner = {
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
      options.tsconfigPath = absoluteTSConfigPath;
    } catch {
      // Cannot read `tsconfigPath`
    }
  }
  return options;
}

function getExtensionConfig(workspace: RemoteWorkspace): Promise<BettererExtensionConfig> {
  return workspace.getConfiguration({ section: 'betterer' }) as Promise<BettererExtensionConfig>;
}
