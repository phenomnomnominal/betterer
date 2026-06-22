// =============================================================================
// STRESS TEST for the `@betterer/betterer` public API.
//
// This file deliberately pokes at the *edges* of the public API — odd inputs,
// type-vs-runtime mismatches, surprising defaults, global side effects, and
// non-obvious bucketing rules. Every assertion encodes the *actual observed*
// behaviour of the library, so the file doubles as executable documentation of
// the quirks. Lines tagged `// SURPRISE:` mark behaviour that contradicts the
// public types, the docs, or a reasonable mental model.
//
// All runs use `workers: false` (or `BETTERER_WORKER=false`) to stay in-process.
// =============================================================================

import { describe, expect, it } from 'vitest';

import { createFixture } from './fixture.js';

// ---------------------------------------------------------------------------
// BettererFileTest result building (exercised through a real run)
// ---------------------------------------------------------------------------
describe('stress: file-test result building', () => {
  it('SURPRISE: `addIssue` LineColLength `length` arg is overwritten by the real substring length', async () => {
    const { betterer } = await import('@betterer/betterer');
    const { paths, resolve, writeFile, readFile, cleanup } = await createFixture('stress-addissue-length', {
      '.betterer.ts': `
import { BettererFileTest } from '@betterer/betterer';
export default { t: () => new BettererFileTest((filePaths, fileTestResult) => {
  const file = fileTestResult.addFile(filePaths[0], 'hello world');
  file.addIssue(0, 0, 999, 'msg');
}).include('**/*.txt') };
`
    });
    await writeFile(resolve('./target.txt'), 'hello world');

    await betterer({ configPaths: [paths.config], resultsPath: paths.results, cwd: paths.cwd, workers: false });
    const out = await readFile(paths.results);
    // The declared length 999 is replaced by the actual clamped substring length (11):
    expect(out).not.toContain('999');
    await cleanup();
  });

  it('SURPRISE: `addIssue` with a non-string message fails the run with a misleading "must start with 2, 3, or 4 numbers"', async () => {
    const { betterer } = await import('@betterer/betterer');
    const { paths, resolve, writeFile, cleanup } = await createFixture('stress-addissue-msg', {
      '.betterer.ts': `
import { BettererFileTest } from '@betterer/betterer';
export default { t: () => new BettererFileTest((filePaths, fileTestResult) => {
  const file = fileTestResult.addFile(filePaths[0], 'abc');
  file.addIssue(0, 1, 123);
}).include('**/*.txt') };
`
    });
    await writeFile(resolve('./target.txt'), 'abc');

    const suite = await betterer({
      configPaths: [paths.config],
      resultsPath: paths.results,
      cwd: paths.cwd,
      workers: false
    });
    const [failed] = suite.failed;
    expect(failed?.error?.message).toContain('must start with 2, 3, or 4 numbers');
    await cleanup();
  });

  it('SURPRISE: `addFile`s `absolutePath` arg is resolved as relative against the base directory', async () => {
    const { betterer } = await import('@betterer/betterer');
    const { paths, resolve, writeFile, readFile, cleanup } = await createFixture('stress-addfile-relative', {
      '.betterer.ts': `
import { BettererFileTest } from '@betterer/betterer';
export default { t: () => new BettererFileTest((filePaths, fileTestResult) => {
  const file = fileTestResult.addFile('foo.txt', 'x');
  file.addIssue(0, 1, 'msg');
}).include('**/*.txt') };
`
    });
    await writeFile(resolve('./target.txt'), 'x');

    await betterer({ configPaths: [paths.config], resultsPath: paths.results, cwd: paths.cwd, workers: false });
    const out = await readFile(paths.results);
    expect(out).toContain('foo.txt');
    await cleanup();
  });

  it('SURPRISE: `cache()` accepts any value as a strategy with no enum validation', async () => {
    const { betterer } = await import('@betterer/betterer');
    const { paths, resolve, writeFile, cleanup } = await createFixture('stress-cache-strategy', {
      '.betterer.ts': `
import { BettererFileTest } from '@betterer/betterer';
export default { t: () => new BettererFileTest((filePaths, fileTestResult) => {
  filePaths.forEach((filePath) => fileTestResult.addFile(filePath, 'x'));
}).include('**/*.txt').cache('TotalNonsense') };
`
    });
    await writeFile(resolve('./a.txt'), 'x');

    // No throw despite the bogus strategy:
    const suite = await betterer({
      configPaths: [paths.config],
      resultsPath: paths.results,
      cwd: paths.cwd,
      workers: false,
      cache: true,
      cachePath: paths.cache
    });
    expect(suite.failed.length).toBe(0);
    await cleanup();
  });
});

// ---------------------------------------------------------------------------
// betterer.results()
// ---------------------------------------------------------------------------
describe('stress: results()', () => {
  it('summarises the current result for a test', async () => {
    const { betterer, results } = await import('@betterer/betterer');
    const { paths, cleanup } = await createFixture('stress-results-basic', {
      '.betterer.ts': `
import { BettererTest } from '@betterer/betterer';
import { bigger } from '@betterer/constraints';
export default { t: () => new BettererTest({ test: () => 1, constraint: bigger, goal: 100 }) };
`
    });

    await betterer({ configPaths: [paths.config], resultsPath: paths.results, workers: false, silent: true });
    const summary = await results({ configPaths: [paths.config], resultsPath: paths.results });
    const found = summary.resultSummaries.find((resultSummary) => resultSummary.name === 't');
    expect(found?.isFileTest).toBe(false);
    expect(!found?.isFileTest && found?.details).toBe('1\n');
    await cleanup();
  });
});

// ---------------------------------------------------------------------------
// betterer.merge()
// ---------------------------------------------------------------------------
describe('stress: merge()', () => {
  it('SURPRISE: with two `contents`, `theirs` fully replaces `ours` for a shared key (shallow spread)', async () => {
    const { merge } = await import('@betterer/betterer');
    const { paths, readFile, cleanup } = await createFixture('stress-merge-collide', {
      '.betterer.results': `// BETTERER RESULTS V2.\n`
    });
    process.env.BETTERER_WORKER = 'false';

    await merge({
      resultsPath: paths.results,
      contents: ['exports[`t`] = { value: `OURS` };', 'exports[`t`] = { value: `THEIRS` };']
    });
    const out = await readFile(paths.results);
    expect(out).toContain('THEIRS');
    expect(out).not.toContain('OURS');
    await cleanup();
  });

  it('SURPRISE: a single-element `contents` array is silently ignored (re-parses the file instead)', async () => {
    const { merge } = await import('@betterer/betterer');
    const { paths, readFile, cleanup } = await createFixture('stress-merge-single', {
      '.betterer.results': `// BETTERER RESULTS V2.\nexports[\`a\`] = {\n  value: \`1\`\n};\n`
    });
    process.env.BETTERER_WORKER = 'false';

    await merge({ resultsPath: paths.results, contents: ['exports[`b`] = { value: `2` };'] });
    const out = await readFile(paths.results);
    expect(out).toContain('`a`');
    expect(out).not.toContain('`b`');
    await cleanup();
  });

  it('SURPRISE: 3+ `contents` entries silently drop everything after the first two', async () => {
    const { merge } = await import('@betterer/betterer');
    const { paths, readFile, cleanup } = await createFixture('stress-merge-three', {
      '.betterer.results': `// BETTERER RESULTS V2.\n`
    });
    process.env.BETTERER_WORKER = 'false';

    await merge({
      resultsPath: paths.results,
      contents: ['exports[`a`]={value:`1`};', 'exports[`b`]={value:`2`};', 'exports[`c`]={value:`3`};']
    });
    const out = await readFile(paths.results);
    expect(out).toContain('`a`');
    expect(out).toContain('`b`');
    expect(out).not.toContain('`c`');
    await cleanup();
  });

  it('SURPRISE: `merge()` mutates global process.exitCode to 1 on any throw, even when caught', async () => {
    const { merge } = await import('@betterer/betterer');
    const before = process.exitCode;
    process.exitCode = 0;

    try {
      await merge({ resultsPath: '/nonexistent/path/.betterer.results' });
    } catch {
      // handled
    }
    expect(process.exitCode).toBe(1);
    process.exitCode = before;
  });
});
