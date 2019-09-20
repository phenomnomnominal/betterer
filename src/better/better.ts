import { error, info, success, warn } from '../logger';
import { print } from './printer';
import { read } from './reader';
import { serialise } from './serialiser';
import { BetterConfig, BetterResults, BetterStats, BetterTests } from './types';
import { write } from './writer';

export async function better(config: BetterConfig): Promise<BetterStats> {
  info('running better!');

  const { configPath, filters, resultsPath } = config;
  const tests: BetterTests = await import(configPath);
  const testsToRun = Object.keys(tests).filter(testName => {
    if (!filters) {
      return true;
    }
    return filters.some(filter => filter.test(testName));
  });

  let expectedResults: BetterResults = {};
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

  const stats: BetterStats = {
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

  const results: BetterResults = { ...expectedResults };

  await Promise.all(
    testsToRun.map(async testName => {
      const { test, constraint, goal } = tests[testName];

      let result: unknown;
      try {
        info(`running "${testName}"!`);
        result = await test();
      } catch {
        stats.failed.push(testName);
        stats.messages.push(`"${testName}" failed to run.`);
        return;
      }
      stats.ran.push(testName);

      const current = {
        timestamp: Date.now(),
        value: serialise(result)
      };
      const previous = expectedResults[testName];

      // New test:
      if (!previous) {
        results[testName] = current;
        stats.new.push(testName);
        return;
      }

      const isSame = current.value === previous.value;
      const serialisedGoal = serialise(goal);

      // Same, but already met goal:
      if (isSame && current.value === serialisedGoal) {
        stats.completed.push(testName);
        return;
      }

      // Same:
      if (isSame) {
        results[testName] = current;
        stats.same.push(testName);
        return;
      }

      const isBetter = await constraint(
        JSON.parse(current.value),
        JSON.parse(previous.value)
      );

      // Better:
      if (isBetter) {
        stats.better.push(testName);
        results[testName] = current;
        // Newly met goal:
        if (current.value === serialisedGoal) {
          stats.completed.push(testName);
        }
        return;
      }

      // Worse:
      stats.worse.push(testName);
      stats.messages.push(`"${testName}" got worse`);
      results[testName] = previous;
    })
  );

  const ran = stats.ran.length;
  const nnew = stats.new.length;
  const failed = stats.failed.length;
  const obsolete = stats.obsolete.length;
  const better = stats.better.length;
  const worse = stats.worse.length;
  const same = stats.same.length;
  const { completed, messages } = stats;

  info(`${ran} ${getThings(ran)} got checked. 🤩`);
  if (nnew) {
    info(`${nnew} ${getThings(nnew)} got checked for the first time. 😎`);
  }
  if (failed) {
    info(`${failed} ${getThings(failed)} failed to run. 🔥`);
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
