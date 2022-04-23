import '@betterer/fixture';
import { jest } from '@jest/globals';
import { replace } from 'testdouble';

import { setupTestdouble } from './setup-testdouble';

jest.setTimeout(300000);

setupTestdouble();

import * as bettererUtils from '../packages/betterer/dist/utils.js';

replace('../packages/betterer/dist/utils.js', {
  ...bettererUtils,
  getTime: () => 0
});

replace('../packages/tasks/dist/utils.js', {
  getTime: () => 0,
  getPreciseTime: () => 0
});
