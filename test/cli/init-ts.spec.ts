import type { BettererPackageJSON } from '@betterer/cli';

// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer'];

import { version } from '../../packages/cli/package.json';

describe('betterer cli', () => {
  it('should initialise betterer in a repo with TS', async () => {
    const { cli__ } = await import('@betterer/cli');

    const { cleanup, logs, paths, readFile, resolve } = await createFixture(
      'init-ts',
      {
        'package.json': `
      {
        "name": "init-ts",
        "version": "0.0.1"
      }
      `
      },
      {
        logFilters: [/🌟 Initialising Betterer/]
      }
    );

    const configPath = `${paths.config}.ts`;
    const fixturePath = paths.cwd;
    const packageJSONPath = resolve('./package.json');

    await cli__(fixturePath, [...ARGV, 'init']);

    const packageJSON = JSON.parse(await readFile(packageJSONPath)) as BettererPackageJSON;

    expect(packageJSON.scripts.betterer).toEqual('betterer');
    expect(packageJSON.devDependencies['@betterer/cli']).toEqual(`^${version}`);
    expect(packageJSON.devDependencies['typescript']).toBeDefined();

    const config = await readFile(configPath);

    expect(config).toEqual('export default {\n  // Add tests here ☀️\n};\n');

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
