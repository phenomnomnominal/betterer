import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

const STYLES_SOURCE = `
a {
  b & {}
  & b {}
  &:hover {}
}
`;

describe('betterer', () => {
  it('should report the status of a new stylelint rule', async () => {
    const { logs, paths, resolve, readFile, writeFile, cleanup, runNames } = await createFixture(
      'test-betterer-stylelint',
      {
        '.betterer.ts': `
import { stylelint } from '@betterer/stylelint';

export default {
  'stylelint enable new rule': stylelint({
    rules: {
      'order/order': [
        { type: 'rule' },
        { type: 'rule', selector: /^&:\\w/ },
        { type: 'rule', selector: /^&/ },
      ]
    }
  }).include('./src/**/*.scss')
};
      `,
        '.stylelintrc.json': `
{
  "plugins": ["stylelint-order"]
}
      `,
        'src/styles.scss': STYLES_SOURCE
      }
    );

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const stylesPath = resolve('./src/styles.scss');

    const newTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(newTestRun.new)).toEqual(['stylelint enable new rule']);

    await writeFile(stylesPath, `${STYLES_SOURCE}${STYLES_SOURCE}`);

    const worseTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(worseTestRun.worse)).toEqual(['stylelint enable new rule']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await writeFile(stylesPath, '');

    const betterTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(betterTestRun.better)).toEqual(['stylelint enable new rule']);

    const completedTestRun = await betterer({ configPaths, resultsPath });

    expect(runNames(completedTestRun.completed)).toEqual(['stylelint enable new rule']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });

  it('should throw if there is no config', async () => {
    const { paths, logs, cleanup } = await createFixture('test-betterer-stylelint-no-config', {
      '.betterer.js': `
const { stylelint } = require('@betterer/stylelint');

module.exports = {
  'stylelint no config': stylelint().include('./src/**/*.csss')
};      
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    await expect(async () => await betterer({ configPaths, resultsPath })).rejects.toThrow();

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
