import { ConstraintResult } from '@betterer/constraints';
import { br, error, header, info, success, warn } from '@betterer/logger';
import * as logDiff from 'jest-diff';

import { print } from './printer';
import { read } from './reader';
import { serialise } from './serialiser';
import {
  BettererConfig,
  BettererGoalFunction,
  BettererGoal,
  BettererResult,
  BettererResults,
  BettererStats,
  BettererTests
} from './types';
import { write } from './writer';

export async function betterer(config: BettererConfig): Promise<BettererStats> {
  header(`
   \\ | /     _          _   _                     
 '-.ooo.-'  | |__   ___| |_| |_ ___ _ __ ___ _ __ 
---ooooo--- | '_ \\ / _ \\ __| __/ _ \\ '__/ _ \\ '__|
 .-'ooo'-.  | |_) |  __/ |_| ||  __/ | |  __/ |   
   / | \\    |_.__/ \\___|\\__|\\__\\___|_|  \\___|_|   
 `);

  const { configPaths, filters, resultsPath } = config;
  let tests: BettererTests = {};
  await Promise.all(
    configPaths.map(async configPath => {
      const moreTests = await getTests(configPath);
      tests = { ...tests, ...moreTests };
    })
  );
  const testsToRun = Object.keys(tests).filter(testName => {
    if (!filters) {
      return true;
    }
    return filters.some(filter => filter.test(testName));
  });

  let expectedResults: BettererResults = {};
  if (resultsPath) {
    try {
      expectedResults = await read(resultsPath);
    } catch {
      error(`could not read results from "${resultsPath}". 😔`);
      throw new Error();
    }
  }

  const obsoleteNames = Object.keys(expectedResults).filter(
    testName => !tests[testName]
  );
  obsoleteNames.forEach(obsoleteName => {
    delete expectedResults[obsoleteName];
  });

  const stats: BettererStats = {
    obsolete: obsoleteNames,
    ran: [],
    failed: [],
    new: [],
    better: [],
    same: [],
    worse: [],
    completed: []
  };

  const results: BettererResults = { ...expectedResults };

  await testsToRun.reduce(async (p, testName) => {
    await p;

    const { test, constraint, goal } = tests[testName];
    const diff = tests[testName].diff || defaultDiff;

    let current: unknown;
    try {
      info(`running "${testName}"!`);
      current = await test(config);
    } catch {
      stats.failed.push(testName);
      error(`"${testName}" failed to run. 🔥`);
      return;
    }
    stats.ran.push(testName);

    // Get the serialised previous results from the test results file:
    const serialisedPrevious = expectedResults[testName]
      ? JSON.parse(expectedResults[testName].value as string)
      : null;

    // Serialise the current results so that the `constraint`, `diff`, and
    // `goal` can be evaluated on the same shape object:
    const serialisedCurrent = serialise(current);

    // New test:
    if (!Object.hasOwnProperty.call(expectedResults, testName)) {
      results[testName] = update(current);
      stats.new.push(testName);
      success(`"${testName}" got checked for the first time! 🎉`);
      return;
    }

    const checkGoal = createGoal(goal);

    const comparison = await constraint(serialisedCurrent, serialisedPrevious);
    const isSame = comparison === ConstraintResult.same;
    const isBetter = comparison === ConstraintResult.better;

    // Same, but already met goal:
    if (isSame && checkGoal(serialisedCurrent)) {
      stats.completed.push(testName);
      success(`"${testName}" has already met its goal! ✨`);
      return;
    }

    // Same:
    if (isSame) {
      stats.same.push(testName);
      warn(`"${testName}" stayed the same. 😐`);
      return;
    }

    // Better:
    if (isBetter) {
      results[testName] = update(current);
      stats.better.push(testName);

      // Newly met goal:
      if (checkGoal(serialisedCurrent)) {
        stats.completed.push(testName);
        success(`"${testName}" met its goal! 🎉`);
        return;
      }

      // Not reached goal yet:
      success(`"${testName}" got better! 😍`);
      return;
    }

    // Worse:
    stats.worse.push(testName);
    error(`"${testName}" got worse. 😔`);
    br();
    diff(current, serialisedCurrent, serialisedPrevious);
    br();
  }, Promise.resolve());

  const ran = stats.ran.length;
  const failed = stats.failed.length;
  const nnew = stats.new.length;
  const obsolete = stats.obsolete.length;
  const better = stats.better.length;
  const worse = stats.worse.length;
  const same = stats.same.length;
  const { completed } = stats;

  info(`${ran} ${getThings(ran)} got checked. 🤔`);
  if (failed) {
    error(`${failed} ${getThings(failed)} failed to run. 🔥`);
  }
  if (nnew) {
    info(`${nnew} ${getThings(nnew)} got checked for the first time! 🎉`);
  }
  if (obsolete) {
    info(`${obsolete} ${getThings(obsolete)} are no longer needed! 🤪`);
  }
  if (better) {
    success(`${better} ${getThings(better)} got better! 😍`);
  }
  if (completed.length) {
    completed.forEach(testName => {
      success(`"${testName}" met its goal! 🎉`);
    });
  }
  if (worse) {
    error(`${worse} ${getThings(worse)} got worse. 😔`);
  }
  if (same) {
    warn(`${same} ${getThings(same)} stayed the same. 😐`);
  }

  const printed = print(results);

  let printError = '';
  if (resultsPath) {
    try {
      await write(printed, resultsPath);
    } catch {
      printError = `could not write results to "${resultsPath}". 😔`;
    }
  } else {
    printError = `no \`resultsPath\` given. 😔`;
  }

  if (printError) {
    error(printError);
    error('printing to stdout instead:');
    console.log(`\n\n\n${printed}\n\n\n`);
  }

  return stats;
}

function getThings(count: number): string {
  return count === 1 ? 'thing' : 'things';
}

async function getTests(configPath: string): Promise<BettererTests> {
  try {
    const imported = await import(configPath);
    return imported.default ? imported.default : imported;
  } catch {
    // Couldn't import, doesn't matter...
  }

  error(`could not read tests from "${configPath}". 😔`);
  throw new Error();
}

function defaultDiff(
  _: unknown,
  serialisedCurrent: unknown,
  serialisedPrevious: unknown
): void {
  const diffStr =
    logDiff(serialisedPrevious, serialisedCurrent, {
      aAnnotation: 'Previous',
      bAnnotation: 'Current'
    }) || '';
  console.log(
    diffStr
      .split('\n')
      .map(line => `  ${line}`)
      .join('\n')
  );
}

function createGoal(
  goal: BettererGoal<unknown>
): BettererGoalFunction<unknown> {
  if (typeof goal === 'function') {
    return goal as BettererGoalFunction<unknown>;
  }
  return (value: unknown): boolean => value === goal;
}

function update(value: unknown): BettererResult {
  return {
    timestamp: Date.now(),
    value
  };
}
