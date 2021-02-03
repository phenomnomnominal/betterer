import { RemoteWorkspace } from 'vscode-languageserver/node';
import { BettererConfigPartial } from '@betterer/betterer';

type BettererExtensionConfig = {
  configPath: string;
  enable: boolean;
  filters: Array<string>;
  resultsPath: string;
  tsconfigPath: string;
  update: boolean;
};

export async function getEnabled(workspace: RemoteWorkspace): Promise<boolean> {
  const { enable } = await getConfig(workspace);
  return !!enable;
}

export async function getBettererConfig(workspace: RemoteWorkspace): Promise<BettererConfigPartial> {
  const { configPath, filters, resultsPath, tsconfigPath, update } = await getConfig(workspace);
  const config: BettererConfigPartial = {
    configPaths: configPath,
    filters,
    resultsPath,
    update: !!update
  };
  if (tsconfigPath !== '') {
    config.tsconfigPath = tsconfigPath;
  }
  return config;
}

function getConfig(workspace: RemoteWorkspace): Promise<BettererExtensionConfig> {
  return workspace.getConfiguration({ section: 'betterer' }) as Promise<BettererExtensionConfig>;
}
