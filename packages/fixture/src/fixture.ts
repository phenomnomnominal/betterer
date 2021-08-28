import { BettererRunNames, BettererRunSummaries } from '@betterer/betterer';
import { promises as fs } from 'graceful-fs';
import * as path from 'path';

import { createFixtureFS } from './fs';
import { createFixtureLogs } from './logging';
import { Fixture, FixtureFactory, FixtureFileSystemFiles, FixtureOptions } from './types';

/** @internal Definitely not stable! Please don't use! */
export async function createFixtureDirectoryΔ(fixturesPath: string): Promise<FixtureFactory> {
  try {
    await fs.mkdir(fixturesPath);
  } catch {
    // Move on...
  }

  return async function createFixtureΔ(
    fixtureName: string,
    files?: FixtureFileSystemFiles,
    options?: FixtureOptions
  ): Promise<Fixture> {
    const fixturePath = path.resolve(fixturesPath, fixtureName);
    const fixtureFS = await createFixtureFS(fixturePath, files);

    const fixtureLogs = createFixtureLogs(options);

    // Wait long enough that the watch mode debounce doesn't get in the way:
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      ...fixtureFS,
      logs: fixtureLogs,
      runNames
    };
  };
}

export function runNames(runs: BettererRunSummaries): BettererRunNames {
  return runs.map((run) => run.name);
}
