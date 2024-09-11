import type { BettererTestMetaLoaderWorker } from '../test/index.js';
import type { BettererConfigFS, BettererVersionControlWorker } from './types.js';

import { importWorkerΔ } from '@betterer/worker';

import { BettererResultsFileΩ } from './results-file.js';

export class BettererFSΩ {
  private constructor(
    public readonly resultsFile: BettererResultsFileΩ,
    public readonly testMetaLoader: BettererTestMetaLoaderWorker,
    public readonly versionControl: BettererVersionControlWorker,
    public readonly versionControlPath: string
  ) {}

  public static async create(configFS: BettererConfigFS): Promise<BettererFSΩ> {
    const { cache, cachePath, configPaths, cwd, resultsPath } = configFS;
    const resultsFile = new BettererResultsFileΩ(resultsPath);

    const versionControl: BettererVersionControlWorker = await importWorkerΔ('./version-control.worker.js');

    // Load test meta in a worker so the import cache is always clean:
    const testMetaLoader: BettererTestMetaLoaderWorker = await importWorkerΔ('../test/test-meta/loader.worker.js');
    try {
      const versionControlPath = await versionControl.api.init(configPaths, cwd);
      if (cache) {
        await versionControl.api.enableCache(cachePath);
      }

      return new BettererFSΩ(resultsFile, testMetaLoader, versionControl, versionControlPath);
    } catch (error) {
      await testMetaLoader.destroy();
      await versionControl.destroy();
      throw error;
    }
  }
}
