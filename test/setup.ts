import '@betterer/fixture';
import { beforeEach, vitest } from 'vitest';

vitest.mock('@betterer/time', async (): Promise<typeof import('@betterer/time')> => {
  const time: typeof import('@betterer/time') = await vitest.importActual('@betterer/time');

  return {
    ...time,
    getPreciseTime__: () => 0,
    getTime__: () => 0
  };
});

beforeEach(({ expect }) => {
  process.env.BETTERER_TEST_NAME = expect.getState().currentTestName;
});
