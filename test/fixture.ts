import type { Fixture, FixtureFileSystemFiles, FixtureOptions } from '@betterer/fixture';
import { createFixtureDirectoryΔ } from '@betterer/fixture';
import * as path from 'path';

const fixtureFactory = createFixtureDirectoryΔ(path.resolve(__dirname, '../fixtures'));

export async function createFixture(
  fixtureName: string,
  files?: FixtureFileSystemFiles,
  options?: FixtureOptions
): Promise<Fixture> {
  const factory = await fixtureFactory;
  return await factory(fixtureName, files, options);
}
