import type { BettererFilePath, BettererFilePaths } from '../../fs/types.js';
import type { BettererTestMap, BettererTestMeta, BettererTestsMeta } from './types.js';

import { BettererError } from '@betterer/errors';
import { exposeToMainΔ } from '@betterer/worker';

import { importTranspiledHashed } from '../../fs/index.js';
import { encodeSlug } from './slug.js';

/** @knipignore part of worker API */
export async function loadTestsMeta(configPaths: BettererFilePaths): Promise<BettererTestsMeta> {
  const testsMetaForConfigs = await Promise.all(configPaths.map(async (configPath) => await loadTestMeta(configPath)));
  const testsMeta = testsMetaForConfigs.flat();

  const seen = new Map<string, BettererTestMeta>();
  testsMeta.forEach((testMeta) => {
    const { name, slug, configPath } = testMeta;
    const fold = slug.toLowerCase();
    const existing = seen.get(fold);
    if (existing) {
      if (existing.name === name) {
        throw new BettererError(`Duplicate test name found in "${existing.configPath}" and "${configPath}": "${name}"`);
      }
      throw new BettererError(
        `Test names "${existing.name}" and "${name}" are not unique when compared case-insensitively.`
      );
    }
    seen.set(fold, testMeta);
  });
  return testsMeta;
}

async function loadTestMeta(configPath: BettererFilePath): Promise<BettererTestsMeta> {
  try {
    const [exports, configHash] = (await importTranspiledHashed(configPath)) as [BettererTestMap, string];
    return Object.keys(exports).map((name) => ({ configPath, configHash, name, slug: encodeSlug(name) }));
  } catch (error) {
    throw new BettererError(`could not import config from "${configPath}". 😔`, error as BettererError);
  }
}

exposeToMainΔ({
  loadTestsMeta
});
