// Disable Ink/React DevTools in test:
if (process.env.NODE_ENV === 'test') {
  process.env.DEV = 'false';
}

export { createFixtureDirectoryΔ } from './fixture.js';
export { Fixture, FixtureFactory, FixtureFileSystem, FixtureFileSystemFiles, FixtureOptions, Paths } from './types.js';

import './stubs.js';

export { persist } from './persist.js';
