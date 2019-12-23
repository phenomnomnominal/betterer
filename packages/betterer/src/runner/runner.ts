import { ConstraintResult } from '@betterer/constraints';
import { br, error, info, success, warn } from '@betterer/logger';

import { Betterer } from '../betterer';
import { BettererConfig } from '../config';
import { BettererResult, BettererContext } from '../context';
import { prepare } from './prepare';
import { process } from './process';
import { serialise } from './serialiser';

export async function run(config: BettererConfig): Promise<BettererContext> {
  const context = await prepare(config);
  const { betterers } = context;

  await betterers.reduce(async (p, betterer) => {
    await p;
    await runTest(betterer, context);
  }, Promise.resolve());

  return await process(context);
}

async function runTest(betterer: Betterer, context: BettererContext): Promise<void> {
  const { config, expected, only, results, stats } = context;
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
  const serialisedPrevious = expected[name] ? JSON.parse(expected[name].value as string) : null;

  // Serialise the current results so that the `constraint`, `diff`, and
  // `goal` can be evaluated on the same shape object:
  const serialisedCurrent = await serialise(current);

  // New test:
  if (!Object.hasOwnProperty.call(expected, name)) {
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
}

function update(value: unknown): BettererResult {
  return {
    timestamp: Date.now(),
    value
  };
}
