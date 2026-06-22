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

// An empty config — a valid suite with zero tests. Enough for probes that only
// inspect resolved config or runner lifecycle.
const EMPTY_CONFIG = `export default {};`;

// A config exporting a single plain `BettererTest` whose result is read from a
// sibling `value.txt` file, so we can drive it deterministically across runs
// without relying on the serialised results-file format.
const VALUE_CONFIG = `
import { BettererTest } from '@betterer/betterer';
import { smaller } from '@betterer/constraints';
import { readFileSync } from 'node:fs';

export default {
  t: () => new BettererTest({
    test: () => Number(readFileSync(new URL('./value.txt', import.meta.url), 'utf8')),
    constraint: smaller,
    goal: GOAL
  })
};
`;

function valueConfig(goal: string): string {
  return VALUE_CONFIG.replace('GOAL', goal);
}

// ---------------------------------------------------------------------------
// BettererTest construction & config (pure, no filesystem)
// ---------------------------------------------------------------------------
describe('stress: BettererTest construction', () => {
  it('requires `constraint` and `test`, with distinct error messages', async () => {
    const { BettererTest } = await import('@betterer/betterer');
    const { smaller } = await import('@betterer/constraints');

    try {
      // @ts-expect-error missing constraint
      new BettererTest({ test: () => 1 });
      expect.unreachable();
    } catch (error) {
      expect((error as Error).message).toBe('for a test to work, it must have a `constraint` function. ❌');
    }

    try {
      // @ts-expect-error missing test
      new BettererTest({ constraint: smaller });
      expect.unreachable();
    } catch (error) {
      expect((error as Error).message).toBe('for a test to work, it must have a `test` function. ❌');
    }
  });

  it('SURPRISE: `goal` is required by the type but optional at runtime, defaulting to an unreachable goal', async () => {
    const { BettererTest } = await import('@betterer/betterer');
    const { smaller } = await import('@betterer/constraints');

    // @ts-expect-error goal is required in the type
    const test = new BettererTest({ test: () => 1, constraint: smaller });
    const goal = test.config.goal;

    // Construction succeeds, and the default goal can never be met:
    expect(await goal.call({} as never, 0)).toBe(false);
    expect(await goal.call({} as never, -99999)).toBe(false);
  });

  it('SURPRISE: a value `goal` of 0 survives the nullish check and becomes strict `=== 0`', async () => {
    const { BettererTest } = await import('@betterer/betterer');
    const { smaller } = await import('@betterer/constraints');

    const test = new BettererTest({ test: () => 0, constraint: smaller, goal: 0 });
    const goal = test.config.goal;

    expect(await goal.call({} as never, 0)).toBe(true);
    expect(await goal.call({} as never, 1)).toBe(false);
  });

  it('SURPRISE: an object/array `goal` uses reference equality, so a deep-equal result never completes', async () => {
    const { BettererTest } = await import('@betterer/betterer');

    const goalValue = { count: 0 };
    const test = new BettererTest({
      test: () => ({ count: 0 }),
      constraint: () => 'same' as never,
      goal: goalValue as never
    });
    const goal = test.config.goal;

    expect(await goal.call({} as never, { count: 0 } as never)).toBe(false);
    expect(await goal.call({} as never, goalValue as never)).toBe(true);
  });

  it('SURPRISE: a `NaN` value goal can never be met (NaN !== NaN)', async () => {
    const { BettererTest } = await import('@betterer/betterer');
    const { smaller } = await import('@betterer/constraints');

    const test = new BettererTest({ test: () => NaN, constraint: smaller, goal: NaN });
    expect(await test.config.goal.call({} as never, NaN)).toBe(false);
  });

  it('SURPRISE: `deadline` forwards *any* value to `new Date().getTime()` regardless of the `Date | string` type', async () => {
    const { BettererTest } = await import('@betterer/betterer');
    const { smaller } = await import('@betterer/constraints');

    // Express the surprise robustly: betterer just calls `new Date(input).getTime()`,
    // throwing iff that is NaN. The type only allows `Date | string`, but numbers
    // and booleans coerce silently.
    const inputs: ReadonlyArray<unknown> = [
      1700000000000,
      false,
      true,
      '0',
      '1700000000000',
      'not-a-date',
      new Date(1000)
    ];
    inputs.forEach((input) => {
      const groundTruth = new Date(input as never).getTime();
      if (Number.isNaN(groundTruth)) {
        try {
          new BettererTest({ test: () => 1, constraint: smaller, goal: 0, deadline: input as never });
          expect.unreachable();
        } catch (error) {
          expect((error as Error).message).toBe(`invalid deadline: ${String(input)}`);
        }
      } else {
        const test = new BettererTest({ test: () => 1, constraint: smaller, goal: 0, deadline: input as never });
        expect(test.config.deadline).toBe(groundTruth);
      }
    });
  });

  it('default `deadline` is Infinity', async () => {
    const { BettererTest } = await import('@betterer/betterer');
    const { smaller } = await import('@betterer/constraints');

    const test = new BettererTest({ test: () => 1, constraint: smaller, goal: 0 });
    expect(test.config.deadline).toBe(Infinity);
  });

  it('SURPRISE: `constraint()` override bypasses the null-check the constructor enforces', async () => {
    const { BettererTest } = await import('@betterer/betterer');
    const { smaller } = await import('@betterer/constraints');

    const test = new BettererTest({ test: () => 1, constraint: smaller, goal: 0 });
    // @ts-expect-error null is not a valid constraint
    test.constraint(null);
    expect(test.config.constraint).toBe(null);
  });

  it('SURPRISE: `config` is the live internal object — `readonly` fields are runtime-mutable', async () => {
    const { BettererTest } = await import('@betterer/betterer');
    const { smaller } = await import('@betterer/constraints');

    const test = new BettererTest({ test: () => 1, constraint: smaller, goal: 0 });
    (test.config as { deadline: number }).deadline = 12345;
    expect(test.config.deadline).toBe(12345);
  });

  it('SURPRISE: a test can be both `only()` and `skip()` — no mutual-exclusion guard', async () => {
    const { BettererTest } = await import('@betterer/betterer');
    const { smaller } = await import('@betterer/constraints');

    const test = new BettererTest({ test: () => 1, constraint: smaller, goal: 0 }).only().skip();
    expect(test.isOnly).toBe(true);
    expect(test.isSkipped).toBe(true);
  });

  it('SURPRISE: `new BettererFileTest()` throws outside a run (constructor needs global run state)', async () => {
    const { BettererFileTest } = await import('@betterer/betterer');

    try {
      new BettererFileTest(() => undefined);
      expect.unreachable();
    } catch (error) {
      // The base `BettererTest` can be constructed standalone, but its subclass
      // calls `getGlobals()` in the constructor.
      expect((error as Error).message).toContain('createGlobals');
    }
  });
});

// ---------------------------------------------------------------------------
// Constraints (pure functions from @betterer/constraints)
// ---------------------------------------------------------------------------
describe('stress: constraints', () => {
  it('SURPRISE: any NaN comparison collapses to `worse` (never `same`, never throws)', async () => {
    const { bigger, smaller } = await import('@betterer/constraints');

    expect(bigger(NaN, NaN)).toBe('worse');
    expect(bigger(NaN, 5)).toBe('worse');
    expect(bigger(5, NaN)).toBe('worse');
    expect(smaller(NaN, NaN)).toBe('worse');
    expect(smaller(NaN, 5)).toBe('worse');
  });

  it('uses JS strict-equality semantics for -0/+0 and Infinity', async () => {
    const { bigger } = await import('@betterer/constraints');

    expect(bigger(-0, 0)).toBe('same');
    expect(bigger(Infinity, Infinity)).toBe('same');
    expect(bigger(Infinity, 5)).toBe('better');
  });
});

// ---------------------------------------------------------------------------
// Options validation & coercion (via runner(), which builds config without running)
// ---------------------------------------------------------------------------
describe('stress: options validation', () => {
  it('SURPRISE: setting `cachePath` forces `cache: true` even when `cache: false` is passed', async () => {
    const { runner } = await import('@betterer/betterer');
    const { paths, cleanup } = await createFixture('stress-cachepath', { '.betterer.ts': EMPTY_CONFIG });

    const betterRunner = await runner({
      configPaths: [paths.config],
      resultsPath: paths.results,
      workers: false,
      cache: false,
      cachePath: paths.cache
    });
    expect(betterRunner.config.cache).toBe(true);
    await betterRunner.stop(true);
    await cleanup();
  });

  it('SURPRISE: `workers: 0` is accepted as the disable sentinel (-> 1) despite the "more than zero" error', async () => {
    const { runner } = await import('@betterer/betterer');
    const { paths, cleanup } = await createFixture('stress-workers-zero', { '.betterer.ts': EMPTY_CONFIG });
    const before = process.env.BETTERER_WORKER;

    // @ts-expect-error 0 is not in the documented set
    const betterRunner = await runner({ configPaths: [paths.config], resultsPath: paths.results, workers: 0 });
    expect(betterRunner.config.workers).toBe(1);
    expect(process.env.BETTERER_WORKER).toBe('false');

    await betterRunner.stop(true);
    if (before === undefined) {
      delete process.env.BETTERER_WORKER;
    } else {
      process.env.BETTERER_WORKER = before;
    }
    await cleanup();
  });

  it('`workers` upper bound is inclusive of the CPU count; one more throws', async () => {
    const os = await import('node:os');
    const { runner } = await import('@betterer/betterer');
    const total = os.cpus().length;

    const ok = await createFixture('stress-workers-ok', { '.betterer.ts': EMPTY_CONFIG });
    const okRunner = await runner({ configPaths: [ok.paths.config], resultsPath: ok.paths.results, workers: total });
    expect(okRunner.config.workers).toBe(total);
    await okRunner.stop(true);
    await ok.cleanup();

    const bad = await createFixture('stress-workers-bad', { '.betterer.ts': EMPTY_CONFIG });
    let threw = false;
    try {
      await runner({ configPaths: [bad.paths.config], resultsPath: bad.paths.results, workers: total + 1 });
    } catch {
      threw = true;
    }
    expect(threw).toBe(true);
    await bad.cleanup();
  });

  it('SURPRISE: a string `filter` is compiled as a case-insensitive RegExp source (not a literal match)', async () => {
    const { runner } = await import('@betterer/betterer');
    const { paths, cleanup } = await createFixture('stress-filter-regex', { '.betterer.ts': EMPTY_CONFIG });

    const betterRunner = await runner({
      configPaths: [paths.config],
      resultsPath: paths.results,
      workers: false,
      filters: 'a.b'
    });
    const [first] = betterRunner.config.filters;
    expect(first.source).toBe('a.b');
    expect(first.flags).toBe('i');
    await betterRunner.stop(true);
    await cleanup();
  });

  it('SURPRISE: an empty-string `filter` becomes a match-everything RegExp', async () => {
    const { runner } = await import('@betterer/betterer');
    const { paths, cleanup } = await createFixture('stress-filter-empty', { '.betterer.ts': EMPTY_CONFIG });

    const betterRunner = await runner({
      configPaths: [paths.config],
      resultsPath: paths.results,
      workers: false,
      filters: ''
    });
    const [first] = betterRunner.config.filters;
    expect(first.test('literally anything')).toBe(true);
    await betterRunner.stop(true);
    await cleanup();
  });

  it('SURPRISE: `null` for a boolean flag is silently coerced to `false` and passes validation', async () => {
    const { runner } = await import('@betterer/betterer');
    const { paths, cleanup } = await createFixture('stress-null-bool', { '.betterer.ts': EMPTY_CONFIG });

    // @ts-expect-error strict is a boolean
    const betterRunner = await runner({
      configPaths: [paths.config],
      resultsPath: paths.results,
      workers: false,
      strict: null
    });
    expect(betterRunner.config.strict).toBe(false);
    await betterRunner.stop(true);
    await cleanup();
  });

  it('SURPRISE: `includes` rejects RegExp (unlike filters/excludes), reporting `[{}]` for the RegExp', async () => {
    const { runner } = await import('@betterer/betterer');
    const { paths, cleanup } = await createFixture('stress-includes-regexp', { '.betterer.ts': EMPTY_CONFIG });

    let message = '';
    try {
      // @ts-expect-error includes is string | string[]
      await runner({ configPaths: [paths.config], resultsPath: paths.results, workers: false, includes: [/foo/] });
      expect.unreachable();
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toContain('"includes" must be an array of strings');
    expect(message).toContain('[{}]');
    await cleanup();
  });

  it('extensionless `configPaths` resolve against the import-extension probe list', async () => {
    const { runner } = await import('@betterer/betterer');
    const { paths, cleanup } = await createFixture('stress-extensionless', { '.betterer.ts': EMPTY_CONFIG });

    const noExtension = paths.config.replace(/\.ts$/, '');
    const betterRunner = await runner({ configPaths: [noExtension], resultsPath: paths.results, workers: false });
    expect(betterRunner.config.configPaths[0]).toContain('.betterer.ts');
    await betterRunner.stop(true);
    await cleanup();
  });

  it('a missing config file throws with the resolved path and an emoji', async () => {
    const { betterer } = await import('@betterer/betterer');
    const { paths, cleanup } = await createFixture('stress-missing-config', { '.betterer.ts': EMPTY_CONFIG });

    let message = '';
    try {
      await betterer({
        configPaths: ['./does-not-exist.ts'],
        cwd: paths.cwd,
        resultsPath: paths.results,
        workers: false
      });
      expect.unreachable();
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toContain('could not find config file at');
    expect(message).toContain('does-not-exist.ts');
    await cleanup();
  });
});

// ---------------------------------------------------------------------------
// Mode flags & their precedence (enableMode)
// ---------------------------------------------------------------------------
describe('stress: modes', () => {
  it('SURPRISE: conflicting `ci + update` is silently reconciled by precedence, not rejected', async () => {
    const { runner } = await import('@betterer/betterer');
    const { paths, cleanup } = await createFixture('stress-ci-update', { '.betterer.ts': EMPTY_CONFIG });

    const betterRunner = await runner({
      configPaths: [paths.config],
      resultsPath: paths.results,
      workers: false,
      // @ts-expect-error the mode union forbids ci:true with update:true
      ci: true,
      update: true
    });
    expect(betterRunner.config.ci).toBe(true);
    expect(betterRunner.config.strict).toBe(true);
    expect(betterRunner.config.update).toBe(false);
    await betterRunner.stop(true);
    await cleanup();
  });
});

// ---------------------------------------------------------------------------
// Reporters
// ---------------------------------------------------------------------------
describe('stress: reporters', () => {
  it('SURPRISE: `silent: true` short-circuits reporter loading, so an invalid reporter is never validated', async () => {
    const { betterer } = await import('@betterer/betterer');
    const { paths, resolve, cleanup } = await createFixture('stress-silent-reporter', {
      '.betterer.ts': `
import { BettererTest } from '@betterer/betterer';
import { smaller } from '@betterer/constraints';
export default { a: () => new BettererTest({ test: () => 0, constraint: smaller, goal: 0 }) };
`,
      'reporter.js': `export default { reporter: { notAHook: 'nope' } };`
    });

    // With `silent: true` this resolves; without it the same reporter throws.
    const suite = await betterer({
      configPaths: [paths.config],
      resultsPath: paths.results,
      workers: false,
      silent: true,
      reporters: [resolve('./reporter.js')]
    });
    expect(suite.completed.length).toBe(1);
    await cleanup();
  });
});

// ---------------------------------------------------------------------------
// Runner / watch lifecycle
// ---------------------------------------------------------------------------
describe('stress: runner & watch lifecycle', () => {
  it('SURPRISE: `watch({ strict: true })` silently disables the watcher (strict outranks watch)', async () => {
    const { watch } = await import('@betterer/betterer');
    const { paths, cleanup } = await createFixture('stress-watch-strict', { '.betterer.ts': EMPTY_CONFIG });

    const betterRunner = await watch({
      configPaths: [paths.config],
      resultsPath: paths.results,
      workers: false,
      // @ts-expect-error BettererOptionsWatch types strict as false
      strict: true
    });
    expect(betterRunner.config.watch).toBe(false);
    expect(betterRunner.config.strict).toBe(true);
    await betterRunner.stop(true);
    await cleanup();
  });

  it('SURPRISE: `stop()` on a runner that never ran a suite THROWS (it eagerly reads lastSuite); a second stop() returns null', async () => {
    const { runner } = await import('@betterer/betterer');
    const { paths, cleanup } = await createFixture('stress-stop-twice', { '.betterer.ts': EMPTY_CONFIG });

    const betterRunner = await runner({ configPaths: [paths.config], resultsPath: paths.results, workers: false });

    // The non-force `stop()` overload is typed `Promise<BettererContextSummary>`,
    // but if no suite ever ran it throws while trying to read `lastSuite`:
    let message = '';
    try {
      await betterRunner.stop();
      expect.unreachable();
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toContain('Context has not completed a suite run yet!');

    // The throwing stop() still flipped the runner to "stopped", so a second
    // stop() now short-circuits to null:
    const second = await betterRunner.stop();
    expect(second).toBeNull();
    await cleanup();
  });

  it('SURPRISE: a single `betterer()` run pays a hardcoded ~200ms debounce', async () => {
    const { betterer } = await import('@betterer/betterer');
    const { paths, cleanup } = await createFixture('stress-debounce', { '.betterer.ts': EMPTY_CONFIG });

    const start = Date.now();
    await betterer({ configPaths: [paths.config], resultsPath: paths.results, workers: false });
    expect(Date.now() - start).toBeGreaterThanOrEqual(195);
    await cleanup();
  });

  it('SURPRISE: `queue([])` / `queue()` triggers a FULL run, not a no-op', async () => {
    const { runner } = await import('@betterer/betterer');
    const { paths, resolve, writeFile, cleanup } = await createFixture('stress-queue-empty', {
      '.betterer.ts': `
import { BettererFileTest } from '@betterer/betterer';
export default { t: () => new BettererFileTest((filePaths, fileTestResult) => {
  filePaths.forEach((filePath) => fileTestResult.addFile(filePath, 'x'));
}).include('**/*.txt') };
`
    });
    await writeFile(resolve('./a.txt'), 'x');
    await writeFile(resolve('./b.txt'), 'x');

    const betterRunner = await runner({
      configPaths: [paths.config],
      resultsPath: paths.results,
      cwd: paths.cwd,
      workers: false
    });
    await betterRunner.queue([]);
    const summary = await betterRunner.stop();
    expect(summary?.lastSuite.runSummaries.length).toBeGreaterThan(0);
    await cleanup();
  });
});

// ---------------------------------------------------------------------------
// Suite bucketing (the disjoint-category getters)
// ---------------------------------------------------------------------------
describe('stress: suite bucketing', () => {
  it('SURPRISE: a brand-new test that immediately meets its goal lands in `completed`, not `new`', async () => {
    const { betterer } = await import('@betterer/betterer');
    const { paths, cleanup } = await createFixture('stress-new-complete', {
      '.betterer.ts': `
import { BettererTest } from '@betterer/betterer';
import { smaller } from '@betterer/constraints';
export default { t: () => new BettererTest({ test: () => 0, constraint: smaller, goal: 0 }) };
`
    });

    const suite = await betterer({ configPaths: [paths.config], resultsPath: paths.results, workers: false });
    expect(suite.new.length).toBe(0);
    expect(suite.completed.length).toBe(1);
    await cleanup();
  });

  it('SURPRISE: a `same` run that still meets its goal is reported in `completed`, not `same`', async () => {
    const { betterer } = await import('@betterer/betterer');
    const { paths, cleanup } = await createFixture('stress-same-complete', {
      '.betterer.ts': `
import { BettererTest } from '@betterer/betterer';
import { smaller } from '@betterer/constraints';
export default { t: () => new BettererTest({ test: () => 0, constraint: smaller, goal: 0 }) };
`
    });

    await betterer({ configPaths: [paths.config], resultsPath: paths.results, workers: false });
    const second = await betterer({ configPaths: [paths.config], resultsPath: paths.results, workers: false });
    expect(second.completed.length).toBe(1);
    expect(second.same.length).toBe(0);
    await cleanup();
  });

  it('SURPRISE: a worse run with `update: true` appears only in `updated`, never in `worse`', async () => {
    const { betterer } = await import('@betterer/betterer');
    const { paths, resolve, writeFile, cleanup } = await createFixture('stress-worse-updated', {
      '.betterer.ts': valueConfig('-1')
    });
    await writeFile(resolve('./value.txt'), '0');

    // Baseline: result 0.
    await betterer({ configPaths: [paths.config], resultsPath: paths.results, cwd: paths.cwd, workers: false });

    // Now get worse (5 > 0 for the `smaller` constraint), but with update on:
    await writeFile(resolve('./value.txt'), '5');
    const suite = await betterer({
      configPaths: [paths.config],
      resultsPath: paths.results,
      cwd: paths.cwd,
      workers: false,
      update: true
    });

    expect(suite.worse.length).toBe(0);
    expect(suite.updated.length).toBeGreaterThan(0);
    await cleanup();
  });

  it('SURPRISE: `changed` includes *obsolete* test names, mixing them with printed-diff changes', async () => {
    const { betterer } = await import('@betterer/betterer');
    // Use goals that are never met, so both results persist to the file (a
    // goal-met test could be filtered differently). `gone` is then removed from
    // the config so it becomes obsolete on the second run.
    const keptAndGone = `
import { BettererTest } from '@betterer/betterer';
import { bigger } from '@betterer/constraints';
export default {
  kept: () => new BettererTest({ test: () => 1, constraint: bigger, goal: 100 }),
  gone: () => new BettererTest({ test: () => 1, constraint: bigger, goal: 100 })
};
`;
    const keptOnly = `
import { BettererTest } from '@betterer/betterer';
import { bigger } from '@betterer/constraints';
export default { kept: () => new BettererTest({ test: () => 1, constraint: bigger, goal: 100 }) };
`;
    const { paths, writeFile, cleanup } = await createFixture('stress-changed-obsolete', {
      '.betterer.ts': keptAndGone
    });

    await betterer({ configPaths: [paths.config], resultsPath: paths.results, workers: false });

    await writeFile(paths.config, keptOnly);
    const suite = await betterer({ configPaths: [paths.config], resultsPath: paths.results, workers: false });
    // `gone` has a saved result but no definition -> obsolete -> appears in `changed`:
    expect(suite.obsolete.map((runSummary) => runSummary.name)).toContain('gone');
    expect(suite.changed).toContain('gone');
    await cleanup();
  });

  it('SURPRISE: `betterer()` RESOLVES (never rejects) when a test gets worse — it only sets `suite.error`', async () => {
    const { betterer } = await import('@betterer/betterer');
    const { paths, resolve, writeFile, cleanup } = await createFixture('stress-worse-no-reject', {
      '.betterer.ts': valueConfig('-1')
    });
    await writeFile(resolve('./value.txt'), '0');

    // Baseline result 0:
    await betterer({ configPaths: [paths.config], resultsPath: paths.results, cwd: paths.cwd, workers: false });

    // Now get worse (5 > 0 for `smaller`):
    await writeFile(resolve('./value.txt'), '5');
    const suite = await betterer({
      configPaths: [paths.config],
      resultsPath: paths.results,
      cwd: paths.cwd,
      workers: false
    });

    // The promise resolved rather than rejecting; the failure surfaces only as
    // a populated `worse` bucket and a non-null `error` on the summary:
    expect(suite.worse.length).toBeGreaterThan(0);
    expect(suite.error).toBeInstanceOf(Error);
    await cleanup();
  });
});

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
