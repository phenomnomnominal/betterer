import '@betterer/fixture';
import { jest } from '@jest/globals';

jest.setTimeout(120000);

jest.mock('@betterer/time', (): typeof import('@betterer/time') => {
  const time = jest.requireActual('@betterer/time') as typeof import('@betterer/time');

  return {
    ...time,
    getPreciseTime__: () => 0,
    getTime__: () => 0
  };
});
