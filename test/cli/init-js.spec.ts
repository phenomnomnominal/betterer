import { describe, it, expect } from 'vitest';

import type { BettererPackageJSON } from '@betterer/cli';

import { createFixture } from '../fixture.js';

const ARGV = ['node', './bin/betterer'];

import { version } from '../../packages/cli/package.json';

describe('betterer cli', () => {
  it('should initialise betterer in a repo with JS', async () => {
    const { cli__ } = await import('@betterer/cli');

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

    const fixturePath = paths.cwd;
    const packageJSONPath = resolve('./package.json');

    await cli__(fixturePath, [...ARGV, 'init', '--config', paths.config]);

    const packageJSON = JSON.parse(await readFile(packageJSONPath)) as BettererPackageJSON;

    expect(packageJSON.scripts.betterer).toEqual('betterer');
    expect(packageJSON.devDependencies['@betterer/cli']).toEqual(`^${version}`);
    expect(packageJSON.devDependencies['typescript']).not.toBeDefined();

    const config = await readFile(paths.config);

    expect(config).toEqual('export default {\n  // Add tests here ☀️\n};\n');

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
