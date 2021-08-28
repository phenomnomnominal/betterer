import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

const STYLES_SOURCE = `
a {
  b & {}
  & b {}
  &:hover {}
}

.foo {
  width: 666borks;
}
`;

describe('betterer', () => {
  it('should report the status of a new stylelint rule', async () => {
    const { logs, paths, resolve, readFile, writeFile, cleanup, runNames } = await createFixture('stylelint', {
      '.betterer.ts': `
import { stylelint } from '@betterer/stylelint';

export default {
  stylelint: () => stylelint({
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
  "plugins": ["stylelint-order"],
  "rules": {
    "unit-no-unknown": true
  }
}
      `,
      'src/styles.scss': STYLES_SOURCE
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;
    const stylesPath = resolve('./src/styles.scss');

    const newTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(runNames(newTestRun.new)).toEqual(['stylelint']);

    await writeFile(stylesPath, `${STYLES_SOURCE}${STYLES_SOURCE}`);

    const worseTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(runNames(worseTestRun.worse)).toEqual(['stylelint']);

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await writeFile(stylesPath, '');

    const betterTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(runNames(betterTestRun.better)).toEqual(['stylelint']);

    const completedTestRun = await betterer({ configPaths, resultsPath, workers: false });

    expect(runNames(completedTestRun.completed)).toEqual(['stylelint']);

    expect(logs).toMatchSnapshot();

    await cleanup();
  });
});
