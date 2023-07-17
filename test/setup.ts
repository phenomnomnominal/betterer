import '@betterer/fixture';
import { jest } from '@jest/globals';
import { replace } from 'testdouble';

// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { setupTestdouble } from './setup-testdouble';

jest.setTimeout(300000);

setupTestdouble();

// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import * as bettererUtils from '../packages/betterer/dist/utils';

replace('../packages/betterer/dist/utils', {
  ...bettererUtils,
  getTime: () => 0
});

replace('../packages/tasks/dist/utils.js', {
  getTime: () => 0,
  getPreciseTime: () => 0
});
