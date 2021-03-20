import { BettererPackageJSON, initΔ } from '@betterer/cli';

import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer', 'init'];

import { version } from '../../packages/cli/package.json';

describe('betterer cli', () => {
  it('should initialise betterer in a repo', async () => {
    const { cleanup, logs, paths, readFile, resolve } = await createFixture(
      'test-betterer-init',
      {
        'package.json': `
      {
        "name": "betterer-test-betterer-init",
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

    await initΔ(fixturePath, ARGV);

    const packageJSON = JSON.parse(await readFile(packageJSONPath)) as BettererPackageJSON;

    expect(packageJSON.scripts.betterer).toEqual('betterer');
    expect(packageJSON.devDependencies['@betterer/cli']).toEqual(`^${version}`);
    expect(packageJSON.devDependencies['typescript']).toBeDefined();

    const config = await readFile(configPath);

    expect(config).toEqual('export default {\n  // Add tests here ☀️\n};\n');

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should work multiple times', async () => {
    const { cleanup, logs, paths } = await createFixture(
      'test-betterer-init-multiple',
      {
        'package.json': `
      {
        "name": "betterer-test-betterer-init-multiple",
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

  it('should initialise betterer in a repo with JS', async () => {
    const { cleanup, logs, paths, readFile, resolve } = await createFixture(
      'test-betterer-init-js',
      {
        'package.json': `
      {
        "name": "betterer-test-betterer-init-js",
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

    await initΔ(fixturePath, [...ARGV, '--config', configPath]);

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
