import { Fixture, FixtureFileSystemFiles, createFixtureDirectoryΔ } from '@betterer/fixture';
import * as path from 'path';

const fixtureFactory = createFixtureDirectoryΔ(path.resolve(__dirname, '../fixtures'));

export async function createFixture(fixtureName: string, files: FixtureFileSystemFiles): Promise<Fixture> {
  const factory = await fixtureFactory;
  return factory(fixtureName, files);
}
