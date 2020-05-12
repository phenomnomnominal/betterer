import { init } from '@betterer/cli';

import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer'];

describe('betterer cli', () => {
  it('should initialise betterer in a repo', async () => {
    const { paths, readFile, cleanup, resolve } = await createFixture('test-betterer-init', {
      'package.json': `
      {
        "name": "betterer-test-betterer-init",
        "version": "0.0.1"
      }
      `
    });

    const configPath = `${paths.config}.ts`;
    const fixturePath = paths.fixture;
    const packageJSONPath = resolve('./package.json');

    await init(fixturePath, ARGV);

    const packageJSON = JSON.parse(await readFile(packageJSONPath));

    expect(packageJSON.scripts.betterer).toEqual('betterer');
    expect(packageJSON.devDependencies['@betterer/cli']).toBeDefined();

    const config = await readFile(configPath);

    expect(config).toEqual('export default {\n  // Add tests here ☀️\n};');

    await cleanup();
  });

  it('should work multiple times', async () => {
    const { paths, cleanup } = await createFixture('test-betterer-init', {
      'package.json': `
      {
        "name": "betterer-test-betterer-init",
        "version": "0.0.1"
      }
      `
    });

    const fixturePath = paths.fixture;

    let throws = false;
    try {
      await init(fixturePath, ARGV);
      await init(fixturePath, ARGV);
      await cleanup();
    } catch {
      throws = true;
    }

    expect(throws).toBe(false);
  });
});
