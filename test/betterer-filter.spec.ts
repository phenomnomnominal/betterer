import { start } from '@betterer/cli/src';

import { fixture } from './index';

'../fixtures/test-betterer-filter';

const ARGV = ['node', './bin/betterer'];

describe('betterer init', () => {
  it('should initialise betterer in a repo', async () => {
    const { logs, paths, reset } = fixture('test-betterer-filter');

    const fixturePath = paths.fixture;

    await reset();

    const firstRun = await start(fixturePath, ARGV);

    expect(firstRun.ran).toEqual(['test 1', 'test 2', 'test 3']);

    const secondRun = await start(fixturePath, [...ARGV, '--filter', '1']);

    expect(secondRun.ran).toEqual(['test 1']);

    const thirdRun = await start(fixturePath, [
      ...ARGV,
      '--filter',
      '1',
      '--filter',
      '3'
    ]);

    expect(thirdRun.ran).toEqual(['test 1', 'test 3']);

    expect(logs).toMatchSnapshot();

    await reset();
  });
});
