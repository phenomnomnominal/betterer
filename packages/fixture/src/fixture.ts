import { promises as fs } from 'graceful-fs';
import * as path from 'path';

import { createFixtureFS } from './fs';
import { createFixtureLogs } from './logging';
import { setupModuleMocking, createFixtureStdOut, createFixtureDate } from './mocks';
import {
  Fixture,
  FixtureFactory,
  FixtureFileSystemFiles,
  FixtureOptions,
  FixtureRunSummaries,
  FixtureTestNames
} from './types';

setupModuleMocking();
const fixtureDate = createFixtureDate();
const fixtureStdOut = createFixtureStdOut();

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
    const fixtureLogs = createFixtureLogs(fixtureStdOut, options);

    const getTime = options?.mocks?.getTime;
    if (getTime) {
      fixtureDate.getTime = getTime;
    }

    // Wait long enough that the watch mode debounce doesn't get in the way:
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      ...fixtureFS,
      logs: fixtureLogs,
      testNames
    };
  };
}

export function testNames(runs: FixtureRunSummaries): FixtureTestNames {
  return runs.map((run) => run.name);
}
