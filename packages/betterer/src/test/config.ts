import { BettererError } from '@betterer/errors';
import { BettererLogs, diffΔ } from '@betterer/logger';
import { format } from 'prettier';

import { isFunction } from '../utils';
import {
  BettererTestConfig,
  BettererTestOptions,
  BettererTestOptionsComplex,
  BettererTestGoal,
  BettererDiff
} from './types';

export function createTestConfig<DeserialisedType, SerialisedType, DiffType>(
  options: BettererTestOptions<DeserialisedType, SerialisedType, DiffType>
): BettererTestConfig<DeserialisedType, SerialisedType, DiffType> | BettererTestConfig {
  if (options.constraint == null) {
    throw new BettererError('for a test to work, it must have a `constraint` function. ❌');
  }

  if (options.test == null) {
    throw new BettererError('for a test to work, it must have a `test` function. ❌');
  }

  const deadline = createDeadline(options);
  const goal = createGoal(options);

  if (isComplex(options)) {
    return {
      configPath: '',
      printer: defaultPrinter,
      progress: defaultProgress,
      ...options,
      goal,
      deadline
    } as BettererTestConfig<DeserialisedType, SerialisedType, DiffType>;
  }

  return {
    ...options,
    configPath: '',
    differ: defaultDiffer,
    printer: defaultPrinter,
    progress: defaultProgress,
    serialiser: {
      deserialise: defaultDeserialiser,
      serialise: defaultSerialiser
    },
    goal,
    deadline
  } as BettererTestConfig;
}

export function createDeadline<DeserialisedType, SerialisedType, DiffType>(
  options: Pick<BettererTestOptions<DeserialisedType, SerialisedType, DiffType>, 'deadline'>
): number {
  const { deadline } = options;
  if (deadline == null) {
    return Infinity;
  }
  const maybeDate = new Date(deadline).getTime();
  return !isNaN(maybeDate) ? maybeDate : Infinity;
}

export function createGoal<DeserialisedType, SerialisedType, DiffType>(
  options: Pick<BettererTestOptions<DeserialisedType, SerialisedType, DiffType>, 'goal'>
): BettererTestGoal<DeserialisedType> {
  const { goal } = options;
  if (goal == null) {
    return () => false;
  }
  if (isFunction<BettererTestGoal<DeserialisedType>>(goal)) {
    return goal;
  }
  return (value: DeserialisedType): boolean => value === goal;
}

function isComplex<DeserialisedType, SerialisedType, DiffType>(
  options: BettererTestOptions<DeserialisedType, SerialisedType, DiffType>
): options is BettererTestOptionsComplex<DeserialisedType, SerialisedType, DiffType> {
  const maybeComplex = options as BettererTestOptionsComplex<DeserialisedType, SerialisedType, DiffType>;
  return !!maybeComplex.differ && !!maybeComplex.serialiser;
}

export function defaultDiffer(expected: unknown, result: unknown): BettererDiff<unknown> {
  const diff = diffΔ(expected, result, { aAnnotation: 'Expected', bAnnotation: 'Result' });
  const logs: BettererLogs = diff ? [{ error: diff }] : [];
  return {
    diff: null,
    logs
  };
}

function defaultPrinter(serialised: unknown): string {
  return format(JSON.stringify(serialised), { parser: 'json' });
}

function defaultProgress(): null {
  return null;
}

function defaultDeserialiser(serialised: unknown): unknown {
  return serialised;
}

function defaultSerialiser(deserialised: unknown): unknown {
  return deserialised;
}
