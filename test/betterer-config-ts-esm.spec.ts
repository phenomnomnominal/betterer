import { betterer } from '@betterer/betterer';

import { createFixture } from './fixture';

describe('betterer', () => {
  it('should work with a .betterer.ts file that uses ES modules', async () => {
    const { logs, paths, readFile, cleanup } = await createFixture('test-betterer-config-ts-esm', {
      '.betterer.ts': `
import { bigger } from '@betterer/constraints';

let start = 0;

export default {
  'gets better': {
    test: () => start++,
    constraint: bigger
  }
};
      `,
      'tsconfig.json': `
{
  "compilerOptions": {
    "module": "ESNext",
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["./**/*.ts"],
  "exclude": ["../node_modules/*", "./node_modules/*", "./dist/*"]
}      
      `
    });

    const configPaths = [paths.config];
    const resultsPath = paths.results;

    const firstRun = await betterer({ configPaths, resultsPath });

    expect(firstRun.new).toEqual(['gets better']);

    const secondRun = await betterer({ configPaths, resultsPath });

    expect(secondRun.better).toEqual(['gets better']);

    expect(logs).toMatchSnapshot();

    const result = await readFile(resultsPath);

    expect(result).toMatchSnapshot();

    await cleanup();
  });
});
