import { ConstraintResult } from '@betterer/constraints';
import { br, error, info, success, warn } from '@betterer/logger';

import { BettererConfig } from './config';
import { print } from './printer';
import { read } from './reader';
import { initialise, report, BettererStats } from './statistics';
import { serialise } from './serialiser';
import { createTest } from './test';
import {
  BettererResult,
  BettererResults,
  BettererTests,
  BettererGoalFunction
} from './types';
import { write } from './writer';

export async function run(config: BettererConfig): Promise<BettererStats> {
  const { configPaths, filters, resultsPath } = config;

  let tests: BettererTests = {};
  await Promise.all(
    configPaths.map(async configPath => {
      const moreTests = await getTests(configPath);
      tests = { ...tests, ...moreTests };
    })
  );

  const testsToRun = Object.keys(tests).filter(testName => {
    return !filters || filters.some(filter => filter.test(testName));
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

  const stats = initialise();
  stats.obsolete.push(...obsoleteNames);

  const results: BettererResults = { ...expectedResults };

  await testsToRun.reduce(async (p, testName) => {
    await p;

    const { test, constraint, goal, diff } = tests[testName];
    const checkGoal = goal as BettererGoalFunction<unknown>;

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
    const serialisedCurrent = await serialise(current);

    // New test:
    if (!Object.hasOwnProperty.call(expectedResults, testName)) {
      results[testName] = update(current);
      stats.new.push(testName);
      success(`"${testName}" got checked for the first time! 🎉`);
      return;
    }

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

  report(stats);
  const printed = await print(results);

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
    process.stdout.write(`\n\n\n${printed}\n\n\n`);
  }

  return stats;
}

async function getTests(configPath: string): Promise<BettererTests> {
  try {
    const imported = await import(configPath);
    const tests = imported.default ? imported.default : imported;
    Object.keys(tests).forEach(test => {
      tests[test] = createTest(tests[test]);
    });
    return tests;
  } catch {
    // Couldn't import, doesn't matter...
  }

  error(`could not read tests from "${configPath}". 😔`);
  throw new Error();
}

function update(value: unknown): BettererResult {
  return {
    timestamp: Date.now(),
    value
  };
}
