import type { BettererConfigFS, BettererVersionControlWorker } from './types.js';

import { importWorker__ } from '@betterer/worker';

import { BettererResultsFileΩ } from './results-file.js';
import { BettererFileResolverΩ } from './file-resolver.js';

export class BettererFSΩ {
  private constructor(
    public readonly fileResolver: BettererFileResolverΩ,
    public readonly resultsFile: BettererResultsFileΩ,
    public readonly versionControl: BettererVersionControlWorker,
    public readonly versionControlPath: string
  ) {}

  public static async create(configFS: BettererConfigFS): Promise<BettererFSΩ> {
    const { cache, cachePath, configPaths, cwd, resultsPath } = configFS;
    const resultsFile = new BettererResultsFileΩ(resultsPath);

    const versionControl: BettererVersionControlWorker = importWorker__('./version-control.worker.js');
    try {
      const versionControlPath = await versionControl.api.init(configPaths, cwd);
      if (cache) {
        await versionControl.api.enableCache(cachePath);
      }

      const fileResolver = new BettererFileResolverΩ(cwd, versionControl);

      return new BettererFSΩ(fileResolver, resultsFile, versionControl, versionControlPath);
    } catch (error) {
      await versionControl.destroy();
      throw error;
    }
  }
}
