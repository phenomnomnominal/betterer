import { BettererError } from '@betterer/errors';
import { BettererLogger, diffΔ } from '@betterer/logger';
import { format } from 'prettier';

import { isFunction } from '../utils';
import { BettererTestType } from './type';
import {
  BettererTestConfig,
  BettererTestOptions,
  BettererTestOptionsComplex,
  BettererTestGoal,
  BettererDiff
} from './types';

export function createTestConfig<DeserialisedType, SerialisedType, DiffType>(
  options: BettererTestOptions<DeserialisedType, SerialisedType, DiffType>,
  type = BettererTestType.Unknown
): BettererTestConfig<DeserialisedType, SerialisedType, DiffType> | BettererTestConfig<unknown> {
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
      printer: options.printer || defaultPrinter,
      ...options,
      goal,
      deadline,
      type
    } as BettererTestConfig<DeserialisedType, SerialisedType, DiffType>;
  }

  return {
    ...options,
    differ: defaultDiffer,
    printer: defaultPrinter,
    serialiser: {
      deserialise: defaultDeserialiser,
      serialise: defaultSerialiser
    },
    goal,
    deadline,
    type
  } as BettererTestConfig<unknown>;
}

function createDeadline<DeserialisedType, SerialisedType, DiffType>(
  options: BettererTestOptions<DeserialisedType, SerialisedType, DiffType>
): number {
  const { deadline } = options;
  if (deadline == null) {
    return Infinity;
  }
  const maybeDate = new Date(deadline).getTime();
  return !isNaN(maybeDate) ? maybeDate : Infinity;
}

function createGoal<DeserialisedType, SerialisedType, DiffType>(
  options: BettererTestOptions<DeserialisedType, SerialisedType, DiffType>
): BettererTestGoal<DeserialisedType> {
  const hasGoal = Object.hasOwnProperty.call(options, 'goal');
  if (!hasGoal) {
    return () => false;
  }
  const { goal } = options;
  if (isFunction<BettererTestGoal<DeserialisedType>>(goal)) {
    return goal;
  }
  return (value: DeserialisedType): boolean => value === goal;
}

function isComplex<DeserialisedType, SerialisedType, DiffType>(
  options: BettererTestOptions<DeserialisedType, SerialisedType, DiffType>
): options is BettererTestOptionsComplex<DeserialisedType, SerialisedType, DiffType> {
  const maybeComplex = options as BettererTestOptionsComplex<DeserialisedType, SerialisedType, DiffType>;
  return !!(maybeComplex.differ && maybeComplex.serialiser);
}

export function defaultDiffer(expected: unknown, result: unknown): BettererDiff<unknown, null> {
  return {
    expected,
    result,
    diff: null,
    async log(logger: BettererLogger): Promise<void> {
      const diff = diffΔ(expected, result);
      if (diff) {
        await logger.error(diff);
      }
    }
  };
}

function defaultPrinter(serialised: unknown): string {
  return format(JSON.stringify(serialised), { parser: 'json' });
}

function defaultDeserialiser(serialised: unknown): unknown {
  return serialised;
}

function defaultSerialiser(deserialised: unknown): unknown {
  return deserialised;
}
