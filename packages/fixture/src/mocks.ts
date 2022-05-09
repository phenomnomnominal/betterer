import { replace } from 'testdouble';
import { WriteStream } from 'tty';

import { FixtureMockDate } from './types';

import * as bettererUtils from '../../betterer/dist/utils';
import * as cliRender from '../../cli/dist/render';
import * as reporterRender from '../../reporter/dist/render';

export function setupModuleMocking() {
  /* eslint-disable */
  const jest = require('jest');
  const td = require('testdouble');
  require('testdouble-jest')(td, jest);
  /* eslint-enable */
}

export function createFixtureDate(): FixtureMockDate {
  const mockDate: FixtureMockDate = {
    getTime: () => 0
  };

  replace('../../betterer/dist/utils', {
    ...bettererUtils,
    getTime: () => mockDate.getTime?.() || 0
  });

  replace('../../tasks/dist/utils', {
    getTime: () => 0,
    getPreciseTime: () => 0
  });

  return mockDate;
}

export function createFixtureStdOut() {
  const fixtureStdOut = new WriteStream(1);
  replace('../../cli/dist/render', {
    ...cliRender,
    getRenderOptions: () => {
      return {
        ...cliRender.getRenderOptions(),
        stdout: fixtureStdOut
      };
    }
  });
  replace('../../reporter/dist/render', {
    ...reporterRender,
    getRenderOptions: () => {
      return {
        ...reporterRender.getRenderOptions(),
        stdout: fixtureStdOut
      };
    }
  });
  return fixtureStdOut;
}
