// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from '../fixture';

describe('betterer.watch', () => {
  it.each([{ ignores: 1234 }, { ignores: true }, { ignores: {} }, { ignores: [1234] }])(
    `should throw when there is invalid config: %s`,
    async (config) => {
      const { betterer } = await import('@betterer/betterer');

      const { cleanup, logs, paths } = await createFixture('watch-config-validation', {
        '.betterer.js': ''
      });

      const resultsPath = paths.results;

      // @ts-expect-error testing config errors:
      await expect(async () => await betterer.watch({ configPaths: [], resultsPath, ...config })).rejects.toThrow();

      expect(logs).toMatchSnapshot();

      await cleanup();
    }
  );
});
