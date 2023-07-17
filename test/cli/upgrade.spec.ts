// eslint-disable-next-line require-extensions/require-extensions -- tests not ESM ready yet
import { createFixture } from '../fixture';

const ARGV = ['node', './bin/betterer', 'upgrade'];

describe('betterer upgrade', () => {
  it('should upgrade exported constant objects in an ES module', async () => {
    const { cleanup, logs, paths } = await createFixture(
      'upgrade-exported-constant-object-esm',
      {
        './.betterer.ts': `
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

    const fixturePath = paths.cwd;

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, ARGV);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should upgrade exported constant objects in a CommonJS module', async () => {
    const { cleanup, logs, paths } = await createFixture(
      'upgrade-exported-constant-object-cjs',
      {
        './.betterer.ts': `
const { bigger } = require('@betterer/constraints');

let start = 0;

module.exports.getsBetter = {
  test: () => start++,
  constraint: bigger
};
        `
      },
      {
        logFilters: [/🌟 Upgrading Betterer/]
      }
    );

    const fixturePath = paths.cwd;

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, ARGV);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should upgrade exported constant tests in an ES module', async () => {
    const { cleanup, logs, paths } = await createFixture(
      'upgrade-exported-constant-test-esm',
      {
        './.betterer.ts': `
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

    const fixturePath = paths.cwd;

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, ARGV);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should upgrade exported constant tests in a CommonJS module', async () => {
    const { cleanup, logs, paths } = await createFixture(
      'upgrade-exported-constant-test-cjs',
      {
        './.betterer.ts': `
const { BettererTest } = require('@betterer/betterer');
const { bigger } = require('@betterer/constraints');

let start = 0;

module.exports.getsBetter = new BettererTest({
  test: () => start++,
  constraint: bigger
});
        `
      },
      {
        logFilters: [/🌟 Upgrading Betterer/]
      }
    );

    const fixturePath = paths.cwd;

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, ARGV);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should upgrade exported constant file tests in an ES module', async () => {
    const { cleanup, logs, paths } = await createFixture(
      'upgrade-exported-constant-file-test-esm',
      {
        './.betterer.ts': `
import { BettererFileTest } from '@betterer/betterer';

export const countFiles = new BettererFileTest(async (files, fileTestResult) => {        
  const [filePath] = files;
  const file = fileTestResult.addFile(filePath, '');
  file.addIssue(0, 0, '\`$' + '{key}\`');
});
        `
      },
      {
        logFilters: [/🌟 Upgrading Betterer/]
      }
    );

    const fixturePath = paths.cwd;

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, ARGV);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should upgrade exported constant file tests in a CommonJS module', async () => {
    const { cleanup, logs, paths } = await createFixture(
      'upgrade-exported-constant-file-test-cjs',
      {
        './.betterer.ts': `
const { BettererFileTest } = require('@betterer/betterer');

module.exports.countFiles = new BettererFileTest(async (files, fileTestResult) => {        
  const [filePath] = files;
  const file = fileTestResult.addFile(filePath, '');
  file.addIssue(0, 0, '\`$' + '{key}\`');
});
        `
      },
      {
        logFilters: [/🌟 Upgrading Betterer/]
      }
    );

    const fixturePath = paths.cwd;

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, ARGV);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should upgrade exported constant file tests with include in an ES module', async () => {
    const { cleanup, logs, paths } = await createFixture(
      'upgrade-exported-constant-file-test-include-esm',
      {
        './.betterer.ts': `
import { BettererFileTest } from '@betterer/betterer';

export const countFiles = new BettererFileTest(async (files, fileTestResult) => {        
  const [filePath] = files;
  const file = fileTestResult.addFile(filePath, '');
  file.addIssue(0, 0, '\`$' + '{key}\`');
}).include('./src/**/*.ts');
        `
      },
      {
        logFilters: [/🌟 Upgrading Betterer/]
      }
    );

    const fixturePath = paths.cwd;

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, ARGV);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should upgrade exported constant file tests with include in a CommonJS module', async () => {
    const { cleanup, logs, paths } = await createFixture(
      'upgrade-exported-constant-file-test-include-cjs',
      {
        './.betterer.ts': `
const { BettererFileTest } = require('@betterer/betterer');

module.exports.countFiles = new BettererFileTest(async (files, fileTestResult) => {        
  const [filePath] = files;
  const file = fileTestResult.addFile(filePath, '');
  file.addIssue(0, 0, '\`$' + '{key}\`');
}).include('./src/**/*.ts');
        `
      },
      {
        logFilters: [/🌟 Upgrading Betterer/]
      }
    );

    const fixturePath = paths.cwd;

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, ARGV);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should upgrade exported constant built-in tests in an ES module', async () => {
    const { cleanup, logs, paths } = await createFixture(
      'upgrade-exported-constant-built-in-esm',
      {
        './.betterer.ts': `
import { regexp } from '@betterer/regexp';

export const noHack = regexp(/HACK/i).include('**/*.ts');
        `
      },
      {
        logFilters: [/🌟 Upgrading Betterer/]
      }
    );

    const fixturePath = paths.cwd;

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, ARGV);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should upgrade exported constant built-in tests in a CommonJS module', async () => {
    const { cleanup, logs, paths } = await createFixture(
      'upgrade-exported-constant-built-in-cjs',
      {
        './.betterer.ts': `
const { regexp } = require('@betterer/regexp');

module.exports.noHack = regexp(/HACK/i).include('**/*.ts');
        `
      },
      {
        logFilters: [/🌟 Upgrading Betterer/]
      }
    );

    const fixturePath = paths.cwd;

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, ARGV);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should upgrade exported default test in an ES module', async () => {
    const { cleanup, logs, paths, readFile } = await createFixture(
      'upgrade-exported-default-test-esm',
      {
        './.betterer.ts': `
import { BettererTest, BettererFileTest } from '@betterer/betterer';
import { bigger } from '@betterer/constraints';

let start = 0;

export default {
  getsBetter: {
    test: () => start++,
    constraint: bigger
  },
  'gets better': new BettererTest({
    test: () => start++,
    constraint: bigger
  }),
  countFiles: new BettererFileTest(async (files, fileTestResult) => {        
    const [filePath] = files;
    const file = fileTestResult.addFile(filePath, '');
    file.addIssue(0, 0, '\`$' + '{key}\`');
  }),
  'count files': new BettererFileTest(async (files, fileTestResult) => {        
    const [filePath] = files;
    const file = fileTestResult.addFile(filePath, '');
    file.addIssue(0, 0, '\`$' + '{key}\`');
  }).include('./src/**/*.ts')
}
        `
      },
      {
        logFilters: [/🌟 Upgrading Betterer/]
      }
    );

    const fixturePath = paths.cwd;

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, ARGV);

    await cli__(fixturePath, [...ARGV, '--save']);

    const upgradedConfig = await readFile(`${paths.config}.ts`);

    expect(upgradedConfig).toMatchSnapshot();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should upgrade exported default test in a CJS module', async () => {
    const { cleanup, logs, paths, readFile } = await createFixture(
      'upgrade-exported-default-test-cjs',
      {
        './.betterer.ts': `
const { BettererTest, BettererFileTest } = require('@betterer/betterer');
const { bigger } = require('@betterer/constraints');

let start = 0;

module.exports = {
  getsBetter: {
    test: () => start++,
    constraint: bigger
  },
  'gets better': new BettererTest({
    test: () => start++,
    constraint: bigger
  }),
  countFiles: new BettererFileTest(async (files, fileTestResult) => {        
    const [filePath] = files;
    const file = fileTestResult.addFile(filePath, '');
    file.addIssue(0, 0, '\`$' + '{key}\`');
  }),
  'count files': new BettererFileTest(async (files, fileTestResult) => {        
    const [filePath] = files;
    const file = fileTestResult.addFile(filePath, '');
    file.addIssue(0, 0, '\`$' + '{key}\`');
  }).include('./src/**/*.ts')
}
        `
      },
      {
        logFilters: [/🌟 Upgrading Betterer/]
      }
    );

    const fixturePath = paths.cwd;

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, ARGV);

    await cli__(fixturePath, [...ARGV, '--save']);

    const upgradedConfig = await readFile(`${paths.config}.ts`);

    expect(upgradedConfig).toMatchSnapshot();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it(`should doesn't change things it doesn't need to change`, async () => {
    const { cleanup, logs, paths } = await createFixture(
      'upgrade-unknown',
      {
        './.betterer.ts': `
const { BettererTest } = require('@betterer/betterer');
const { bigger } = require('@betterer/constraints');

let start = 0;

// Don't remove this important comment!
console.log('some stuff here!');

// This stuff shouldn't be in here but let's not break things:
module.exports = {
  num: 9,
  str: 'some string',
  array: [],
  set: new Set(),
  regexp: /regexp/,
  object: {
    notTest: () => 3
  }
}

module.exports.getsBetter = () => new BettererTest({
  test: () => start++,
  constraint: bigger
});

export function foo () {
  console.log('boop');
}

function bar () {
  console.log('boop');
}
        `
      },
      {
        logFilters: [/🌟 Upgrading Betterer/]
      }
    );

    const fixturePath = paths.cwd;

    const { cli__ } = await import('@betterer/cli');

    await cli__(fixturePath, ARGV);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
