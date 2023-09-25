import '@betterer/fixture';
import mock from 'mock-require';
import { beforeEach } from 'vitest';

beforeEach(({ expect }) => {
  // vitest.mock('@betterer/time', async (importOriginal): Promise<typeof import('@betterer/time')> => {
  //   const time: typeof import('@betterer/time') = await importOriginal();
  //   return {
  //     ...time
  //   };
  // });

  mock('@betterer/time', {
    // ...time,
    getPreciseTime__: () => parseInt(process.env.BETTERER_TEST_PRECISE_TIME || '0', 10),
    getTime__: () => parseInt(process.env.BETTERER_TEST_TIME || '0', 10)
  });

  process.env.BETTERER_TEST_NAME = expect.getState().currentTestName;
});
