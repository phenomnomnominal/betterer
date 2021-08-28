import { initΔ } from '@betterer/cli';

import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer'];

describe('betterer cli', () => {
  it('should work multiple times', async () => {
    const { cleanup, logs, paths } = await createFixture(
      'init-multiple',
      {
        'package.json': `
      {
        "name": "init-multiple",
        "version": "0.0.1"
      }
      `
      },
      {
        logFilters: [/🌟 Initialising Betterer/]
      }
    );

    const fixturePath = paths.cwd;

    let throws = false;
    try {
      await initΔ(fixturePath, ARGV);
      await initΔ(fixturePath, ARGV);
      await cleanup();
    } catch {
      throws = true;
    }

    expect(throws).toBe(false);

    expect(logs).toMatchSnapshot();
  });
});
