import { ConstraintResult } from '@betterer/constraints';
import { br, error, info, success, warn } from '@betterer/logger';

import { NamedBetterer, createBetterer } from './betterer';
import { BettererConfig } from './config';
import { print } from './printer';
import { read } from './reader';
import { initialise, report, BettererStats } from './statistics';
import { serialise } from './serialiser';
import { BettererResult, BettererResults } from './types';
import { write } from './writer';

export async function run(config: BettererConfig): Promise<BettererStats> {
  const { configPaths, resultsPath, filters = [] } = config;

  let betterers: Array<NamedBetterer> = [];
  await Promise.all(
    configPaths.map(async configPath => {
      const more = await getBetterers(configPath);
      betterers = [...betterers, ...more];
    })
  );

  if (filters.length) {
    betterers.forEach(betterer => {
      if (!filters.some(filter => filter.test(betterer.name))) {
        betterer.skip();
      }
    });
  }

  const only = betterers.filter(betterer => betterer.isOnly);

  let expectedResults: BettererResults = {};
  if (resultsPath) {
    try {
      expectedResults = await read(resultsPath);
    } catch {
      error(`could not read results from "${resultsPath}". 😔`);
      throw new Error();
    }
  }

  const obsolete = Object.keys(expectedResults).filter(
    name => !betterers.find(betterer => betterer.name === name)
  );
  obsolete.forEach(name => {
    delete expectedResults[name];
  });

  const stats = initialise();
  stats.obsolete.push(...obsolete);

  const results: BettererResults = { ...expectedResults };

  await betterers.reduce(async (p, betterer) => {
    await p;

    const { test, constraint, goal, diff, isSkipped, name } = betterer;

    if (only.length && !only.includes(betterer)) {
      stats.skipped.push(name);
      return;
    }

    if (isSkipped) {
      stats.skipped.push(name);
      return;
    }

    let current: unknown;
    try {
      info(`running "${name}"!`);
      current = await test(config);
    } catch {
      stats.failed.push(name);
      error(`"${name}" failed to run. 🔥`);
      return;
    }
    stats.ran.push(name);

    // Get the serialised previous results from the test results file:
    const serialisedPrevious = expectedResults[name]
      ? JSON.parse(expectedResults[name].value as string)
      : null;

    // Serialise the current results so that the `constraint`, `diff`, and
    // `goal` can be evaluated on the same shape object:
    const serialisedCurrent = await serialise(current);

    // New test:
    if (!Object.hasOwnProperty.call(expectedResults, name)) {
      results[name] = update(current);
      stats.new.push(name);
      success(`"${name}" got checked for the first time! 🎉`);
      return;
    }

    const comparison = await constraint(serialisedCurrent, serialisedPrevious);
    const isSame = comparison === ConstraintResult.same;
    const isBetter = comparison === ConstraintResult.better;

    // Same, but already met goal:
    if (isSame && goal(serialisedCurrent)) {
      stats.completed.push(name);
      success(`"${name}" has already met its goal! ✨`);
      return;
    }

    // Same:
    if (isSame) {
      stats.same.push(name);
      warn(`"${name}" stayed the same. 😐`);
      return;
    }

    // Better:
    if (isBetter) {
      results[name] = update(current);
      stats.better.push(name);

      // Newly met goal:
      if (goal(serialisedCurrent)) {
        stats.completed.push(name);
        success(`"${name}" met its goal! 🎉`);
        return;
      }

      // Not reached goal yet:
      success(`"${name}" got better! 😍`);
      return;
    }

    // Worse:
    stats.worse.push(name);
    error(`"${name}" got worse. 😔`);
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
    console.log(`\n\n\n${printed}\n\n\n`);
  }

  return stats;
}

async function getBetterers(configPath: string): Promise<Array<NamedBetterer>> {
  try {
    const imported = await import(configPath);
    const betterers = imported.default ? imported.default : imported;
    return Object.keys(betterers).map(name => {
      const betterer = createBetterer(betterers[name]);
      (betterer as NamedBetterer).name = name;
      return betterer as NamedBetterer;
    });
  } catch {
    // Couldn't import, doesn't matter...
  }

  error(`could not read "${configPath}". 😔`);
  throw new Error();
}

function update(value: unknown): BettererResult {
  return {
    timestamp: Date.now(),
    value
  };
}
