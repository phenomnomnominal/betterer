import { createFixtureDirectoryΔ, FixtureFactory } from '@betterer/fixture';
import * as path from 'path';

export const createFixture = async (): Promise<FixtureFactory> => {
  return await createFixtureDirectoryΔ(path.resolve(__dirname, '../fixtures'));
};
