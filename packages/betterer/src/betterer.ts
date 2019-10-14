import { ConstraintResult } from '@betterer/constraints';
import { error, info, success, warn } from '@betterer/logger';
import { setConfig } from './config';
import { print } from './printer';
import { read } from './reader';
import { serialise } from './serialiser';
import { stringify } from './stringifier';
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
  setConfig(config);
  info('running betterer!');

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
    messages: [],
    completed: []
  };

  const results: BettererResults = { ...expectedResults };

  await testsToRun.reduce(async (p, testName) => {
    await p;
    const { test, constraint, goal } = tests[testName];

    let current: unknown;
    try {
      info(`running "${testName}"!`);
      current = await test();
    } catch {
      stats.failed.push(testName);
      stats.messages.push(`"${testName}" failed to run.`);
      return;
    }
    stats.ran.push(testName);

    const serialisedCurrent = serialise(current);
    const serialisedPrevious = expectedResults[testName]
      ? JSON.parse(expectedResults[testName].value)
      : null;

    // New test:
    if (!serialisedPrevious) {
      results[testName] = update(serialisedCurrent);
      stats.new.push(testName);
      return;
    }

    const checkGoal = createGoal(goal);

    const comparison = await constraint(serialisedCurrent, serialisedPrevious);

    const isSame = comparison === ConstraintResult.same;
    const isBetter = comparison === ConstraintResult.better;

    // Same, but already met goal:
    if (isSame && checkGoal(serialisedCurrent)) {
      stats.completed.push(testName);
      return;
    }

    // Same:
    if (isSame) {
      stats.same.push(testName);
      return;
    }

    // Better:
    if (isBetter) {
      results[testName] = update(serialisedCurrent);
      stats.better.push(testName);
      // Newly met goal:
      if (checkGoal(serialisedCurrent)) {
        stats.completed.push(testName);
      }
      return;
    }

    // Worse:
    stats.worse.push(testName);
    stats.messages.push(`"${testName}" got worse.`);
  }, Promise.resolve());

  const ran = stats.ran.length;
  const nnew = stats.new.length;
  const failed = stats.failed.length;
  const obsolete = stats.obsolete.length;
  const better = stats.better.length;
  const worse = stats.worse.length;
  const same = stats.same.length;
  const { completed, messages } = stats;

  info(`${ran} ${getThings(ran)} got checked.`);
  if (nnew) {
    info(`${nnew} ${getThings(nnew)} got checked for the first time. 😎`);
  }
  if (failed) {
    error(`${failed} ${getThings(failed)} failed to run. 🔥`);
  }
  if (obsolete) {
    info(`${obsolete} ${getThings(obsolete)} are no longer needed! 🤪`);
  }
  if (better) {
    success(`${better} ${getThings(better)} got better! 😍`);
  }
  if (completed.length) {
    completed.forEach(testName => {
      success(`"${testName}" is all better! 🎉`);
    });
  }
  if (worse) {
    error(`${worse} ${getThings(worse)} got worse. 😔`);
  }
  if (same) {
    warn(`${same} ${getThings(same)} stayed the same. 😐`);
  }

  messages.forEach(message => {
    error(message);
  });

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
    value: stringify(value)
  };
}
