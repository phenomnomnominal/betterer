import { BettererPackageJSON, cli__ } from '@betterer/cli';

import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer'];

import { version } from '../../packages/cli/package.json';

describe('betterer cli', () => {
  it('should initialise betterer in a repo with JS', async () => {
    const { cleanup, logs, paths, readFile, resolve } = await createFixture(
      'init-js',
      {
        'package.json': `
      {
        "name": "init-js",
        "version": "0.0.1"
      }
      `
      },
      {
        logFilters: [/🌟 Initialising Betterer/]
      }
    );

    const configPath = `${paths.config}.js`;
    const fixturePath = paths.cwd;
    const packageJSONPath = resolve('./package.json');

    await cli__(fixturePath, [...ARGV, 'init', '--config', configPath]);

    const packageJSON = JSON.parse(await readFile(packageJSONPath)) as BettererPackageJSON;

    expect(packageJSON.scripts.betterer).toEqual('betterer');
    expect(packageJSON.devDependencies['@betterer/cli']).toEqual(`^${version}`);
    expect(packageJSON.devDependencies['typescript']).not.toBeDefined();

    const config = await readFile(configPath);

    expect(config).toEqual('module.exports = {\n  // Add tests here ☀️\n};\n');

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
