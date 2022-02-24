import { Fixture } from '@betterer/fixture';
import { betterer } from '@betterer/betterer';
import { createFixture } from './fixture';

interface Coverage {
  lines: { total: number; covered: number; skipped: number; pct: number };
  statements: { total: number; covered: number; skipped: number; pct: number };
  functions: { total: number; covered: number; skipped: number; pct: number };
  branches: { total: number; covered: number; skipped: number; pct: number };
  branchesTrue?: { total: number; covered: number; skipped: number; pct: number };
}

const bettererJS = `
const { coverage } = require('@betterer/coverage');

module.exports = {
  test: () => coverage({ baseDir: __dirname })
};      
      `;

async function setupFixture(testName: string, bettererConfig: string = bettererJS) {
  const tsconfig = `
{
"extends": "../../tsconfig.json",
"include": ["./src/**/*", "./.betterer.js"]
}
    `;
  const fixture = await createFixture(`coverage-${testName}`, {
    '.betterer.js': bettererConfig,
    'tsconfig.json': tsconfig
  });

  const configPaths = [fixture.paths.config];
  const resultsPath = fixture.paths.results;

  return { fixture, configPaths, resultsPath };
}

export const totalCoverage: Coverage = {
  lines: { total: 4931, covered: 227, skipped: 0, pct: 4.6 },
  statements: { total: 5185, covered: 236, skipped: 0, pct: 4.55 },
  functions: { total: 1340, covered: 31, skipped: 0, pct: 2.31 },
  branches: { total: 3025, covered: 83, skipped: 0, pct: 2.74 },
  branchesTrue: { total: 0, covered: 0, skipped: 0, pct: 100 }
};
export const fileCoverage: Record<string, Coverage> = {
  'src/file1.ts': {
    lines: { total: 100, covered: 50, skipped: 0, pct: 50 },
    statements: { total: 200, covered: 70, skipped: 0, pct: 35 },
    functions: { total: 20, covered: 5, skipped: 0, pct: 25 },
    branches: { total: 150, covered: 50, skipped: 0, pct: 33.3 }
  },
  'src/file2.ts': {
    lines: { total: 120, covered: 60, skipped: 0, pct: 50 },
    statements: { total: 210, covered: 70, skipped: 0, pct: 33.3 },
    functions: { total: 10, covered: 6, skipped: 0, pct: 60 },
    branches: { total: 150, covered: 50, skipped: 0, pct: 33.3 }
  }
};
export const writeCoverage = async (
  fixture: Fixture,
  files: Record<string, Coverage> = fileCoverage,
  total: Coverage = totalCoverage
) => {
  const coverage: Record<string, Coverage> = {
    total
  };
  Object.keys(files).forEach((filePath) => {
    const resolved = fixture.resolve(filePath);
    coverage[resolved] = files[filePath];
  });

  const coveragePath = fixture.resolve('./coverage/coverage-summary.json');
  await fixture.writeFile(coveragePath, JSON.stringify(coverage));
};

export async function commonSetup(testName: string, bettererConfig: string = bettererJS) {
  const { fixture, configPaths, resultsPath } = await setupFixture(testName, bettererConfig);

  await writeCoverage(fixture);

  const newTestRun = await betterer({ configPaths, resultsPath, workers: false });
  return { fixture, configPaths, resultsPath, newTestRun };
}

export async function commonTeardown(fixture: Fixture) {
  await fixture.cleanup();
}
