import { error } from '@betterer/logger';

import { Betterer, createBetterer } from '../betterer';
import { BettererContext, BettererResults } from '../context';
import { read } from './reader';
import { initialise } from './statistics';

export type BettererConfig = {
  configPaths: Array<string>;
  resultsPath: string;
  filters?: Array<RegExp>;
};

export async function prepare(config: BettererConfig): Promise<BettererContext> {
  const { configPaths, filters = [], resultsPath } = config;

  const stats = initialise();

  let betterers: Array<Betterer> = [];
  await Promise.all(
    configPaths.map(async configPath => {
      const more = await getBetterers(configPath);
      betterers = [...betterers, ...more];
    })
  );

  if (filters.length) {
    betterers.forEach(betterer => {
      if (!filters.some(filter => filter.test(betterer.name))) {
        betterer.skip();
      }
    });
  }

  const only = betterers.filter(betterer => betterer.isOnly);

  let expected: BettererResults = {};
  if (resultsPath) {
    try {
      expected = await read(resultsPath);
    } catch {
      error(`could not read results from "${resultsPath}". 😔`);
      throw new Error();
    }
  }

  const obsolete = Object.keys(expected).filter(name => !betterers.find(betterer => betterer.name === name));
  obsolete.forEach(name => {
    delete expected[name];
  });
  stats.obsolete.push(...obsolete);

  const results = { ...expected };

  return { betterers, config, only, expected, results, stats };
}

async function getBetterers(configPath: string): Promise<Array<Betterer>> {
  try {
    const imported = await import(configPath);
    const betterers = imported.default ? imported.default : imported;
    return Object.keys(betterers).map(name => {
      const betterer = createBetterer(betterers[name]);
      betterer.name = name;
      return betterer;
    });
  } catch {
    // Couldn't import, doesn't matter...
  }

  error(`could not read "${configPath}". 😔`);
  throw new Error();
}
