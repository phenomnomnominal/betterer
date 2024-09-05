import type { BettererConfig } from '../../config/index.js';
import type { BettererTestLoaderWorker, BettererTestsMeta } from './types.js';
import { importWorkerΔ } from '@betterer/worker';

export class BettererTestMetaLoaderΩ {
  private constructor(
    private _config: BettererConfig,
    private _testMetaLoaderWorker: BettererTestLoaderWorker
  ) {}

  public static async create(config: BettererConfig): Promise<BettererTestMetaLoaderΩ> {
    // Load test meta in a worker so the import cache is always clean:
    const testMetaLoader: BettererTestLoaderWorker = await importWorkerΔ('./loader.worker.js');
    return new BettererTestMetaLoaderΩ(config, testMetaLoader);
  }

  public async getTestsMeta(): Promise<BettererTestsMeta> {
    const testsMetaForConfigs = await Promise.all(
      this._config.configPaths.map(
        async (configPath) => await this._testMetaLoaderWorker.api.loadTestMetaFromConfig(configPath)
      )
    );
    return testsMetaForConfigs.flat();
  }

  public async destroy(): Promise<void> {
    await this._testMetaLoaderWorker.destroy();
  }
}
