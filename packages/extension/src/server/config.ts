import { RemoteWorkspace } from 'vscode-languageserver';
import { BettererBaseConfigPartial } from '@betterer/betterer';

type BettererExtensionConfig = {
  configPath: string;
  enable: boolean;
  filters: Array<string>;
  resultsPath: string;
  tsconfigPath: string;
};

export async function getEnabled(workspace: RemoteWorkspace): Promise<boolean> {
  const { enable } = await getConfig(workspace);
  return !!enable;
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
