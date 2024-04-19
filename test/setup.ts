import '@betterer/fixture';

import { beforeEach, vitest } from 'vitest';

beforeEach(({ expect }) => {
  vitest.mock('@betterer/time', async (importOriginal): Promise<typeof import('@betterer/time')> => {
    const time: typeof import('@betterer/time') = await importOriginal();
    return {
      ...time,
      getPreciseTime__: () => 0,
      getTime__: () => 0
    };
  });

  process.env.BETTERER_TEST_NAME = expect.getState().currentTestName;
});
