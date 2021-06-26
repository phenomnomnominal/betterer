import { upgradeΔ } from '@betterer/cli';

import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer', 'upgrade'];

describe('betterer upgrade', () => {
  it('should upgrade exported constant objects', async () => {
    const { cleanup, logs, paths, readFile } = await createFixture(
      'test-betterer-exported-constant-object',
      {
        './betterer.ts': `
import { bigger } from '@betterer/constraints';

let start = 0;

export const getsBetter = {
  test: () => start++,
  constraint: bigger
};
        `
      },
      {
        logFilters: [/🌟 Upgrading Betterer/]
      }
    );

    const configPath = `${paths.config}.ts`;
    const fixturePath = paths.cwd;

    await upgradeΔ(fixturePath, ARGV);

    const upgradedConfig = await readFile(configPath);

    expect(upgradedConfig).toEqual(`
import { BettererTest } from '@betterer/betterer';
import { bigger } from '@betterer/constraints';

let start = 0;

export const getsBetter = () => new BettererTest({
  test: () => start++,
  constraint: bigger
});
    `);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should upgrade exported constant tests', async () => {
    const { cleanup, logs, paths, readFile } = await createFixture(
      'test-betterer-exported-constant-test',
      {
        './betterer.ts': `
import { BettererTest } from '@betterer/betterer';
import { bigger } from '@betterer/constraints';

let start = 0;

export const getsBetter = new BettererTest({
  test: () => start++,
  constraint: bigger
});
        `
      },
      {
        logFilters: [/🌟 Upgrading Betterer/]
      }
    );

    const configPath = `${paths.config}.ts`;
    const fixturePath = paths.cwd;

    await upgradeΔ(fixturePath, ARGV);

    const upgradedConfig = await readFile(configPath);

    expect(upgradedConfig).toEqual(`
import { BettererTest } from '@betterer/betterer';
import { bigger } from '@betterer/constraints';

let start = 0;

export const getsBetter = () => new BettererTest({
  test: () => start++,
  constraint: bigger
});
    `);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should upgrade exported constant file tests', async () => {
    const { cleanup, logs, paths, readFile } = await createFixture(
      'test-betterer-exported-constant-file-test',
      {
        './betterer.ts': `
import { BettererFileTest } from '@betterer/betterer';

export const countFiles = new BettererFileTest(async (files, fileTestResult) => {        
  const [filePath] = files;
  const file = fileTestResult.addFile(filePath, '');
  file.addIssue(0, 0, "\`$" + "{key}\`");
}).include('./src/**/*.ts');
        `
      },
      {
        logFilters: [/🌟 Upgrading Betterer/]
      }
    );

    const configPath = `${paths.config}.ts`;
    const fixturePath = paths.cwd;

    await upgradeΔ(fixturePath, ARGV);

    const upgradedConfig = await readFile(configPath);

    expect(upgradedConfig).toEqual(`
import { BettererFileTest } from '@betterer/betterer';

export const countFiles = () => new BettererFileTest(async (files, fileTestResult) => {        
  const [filePath] = files;
  const file = fileTestResult.addFile(filePath, '');
  file.addIssue(0, 0, "\`$" + "{key}\`");
}).include('./src/**/*.ts')
    `);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should upgrade exported constant built-in tests', async () => {
    const { cleanup, logs, paths, readFile } = await createFixture(
      'test-betterer-exported-constant-file-test',
      {
        './betterer.ts': `
import { regexp } from '@betterer/regexp';

export const noHack = () => regexp(/HACK/i).include('.**/*.ts');
        `
      },
      {
        logFilters: [/🌟 Upgrading Betterer/]
      }
    );

    const configPath = `${paths.config}.ts`;
    const fixturePath = paths.cwd;

    await upgradeΔ(fixturePath, ARGV);

    const upgradedConfig = await readFile(configPath);

    expect(upgradedConfig).toEqual(`
import { regexp } from '@betterer/regexp';

export const noHack = () => regexp(/HACK/i).include('.**/*.ts');
    `);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
