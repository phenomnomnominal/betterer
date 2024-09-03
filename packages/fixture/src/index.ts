// Disable Ink/React DevTools in test:
/* eslint-disable @typescript-eslint/dot-notation -- environment variable 🌏 */
if (process.env['NODE_ENV'] === 'test') {
  process.env['DEV'] = 'false';
}
/* eslint-enable @typescript-eslint/dot-notation */

import './stubs.js';

export type {
  Fixture,
  FixtureFactory,
  FixtureFileSystem,
  FixtureFileSystemFiles,
  FixtureOptions,
  Paths
} from './types.js';

export { createFixtureDirectoryΔ } from './fixture.js';
export { persist } from './persist.js';
