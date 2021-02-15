import { BettererError } from '@betterer/errors';
import { BettererLogger, diffΔ } from '@betterer/logger';
import { format } from 'prettier';

import { isFunction } from '../utils';
import {
  BettererTestConfig,
  BettererTestConfigPartial,
  BettererTestConfigComplexPartial,
  BettererTestGoal,
  BettererDiff
} from './types';

export function createTestConfig<DeserialisedType, SerialisedType, DiffType>(
  config: BettererTestConfigPartial<DeserialisedType, SerialisedType, DiffType>
): BettererTestConfig<DeserialisedType, SerialisedType, DiffType> | BettererTestConfig<unknown> {
  if (config.constraint == null) {
    throw new BettererError('for a test to work, it must have a `constraint` function. ❌');
  }

  if (config.test == null) {
    throw new BettererError('for a test to work, it must have a `test` function. ❌');
  }

  const deadline = createDeadline(config);
  const goal = createGoal(config);

  if (isComplex(config)) {
    return {
      ...config,
      deadline,
      printer: config.printer || defaultPrinter,
      counter: config.counter || defaultCounter
    } as BettererTestConfig<DeserialisedType, SerialisedType, DiffType>;
  }

  return {
    ...config,
    counter: defaultCounter,
    differ: defaultDiffer,
    printer: defaultPrinter,
    serialiser: {
      deserialise: defaultDeserialiser,
      serialise: defaultSerialiser
    },
    goal,
    deadline
  } as BettererTestConfig<unknown>;
}

function createDeadline<DeserialisedType, SerialisedType, DiffType>(
  options: BettererTestConfigPartial<DeserialisedType, SerialisedType, DiffType>
): number {
  const { deadline } = options;
  if (deadline == null) {
    return Infinity;
  }
  const maybeDate = new Date(deadline).getTime();
  return !isNaN(maybeDate) ? maybeDate : Infinity;
}

function createGoal<DeserialisedType, SerialisedType, DiffType>(
  options: BettererTestConfigPartial<DeserialisedType, SerialisedType, DiffType>
): BettererTestGoal<DeserialisedType> | null {
  const hasGoal = Object.hasOwnProperty.call(options, 'goal');
  if (!hasGoal) {
    return null;
  }
  const { goal } = options;
  if (isFunction<BettererTestGoal<DeserialisedType>>(goal)) {
    return goal;
  }
  return (value: DeserialisedType): boolean => value === goal;
}

function isComplex<DeserialisedType, SerialisedType, DiffType>(
  config: BettererTestConfigPartial<DeserialisedType, SerialisedType, DiffType>
): config is BettererTestConfigComplexPartial<DeserialisedType, SerialisedType, DiffType> {
  const maybeComplex = config as BettererTestConfigComplexPartial<DeserialisedType, SerialisedType, DiffType>;
  return !!(maybeComplex.differ && maybeComplex.serialiser);
}

function defaultCounter(deserialised: unknown): number | null {
  if (Array.isArray(deserialised)) {
    return deserialised.length;
  }
  if (deserialised instanceof Map || deserialised instanceof Set) {
    return deserialised.size;
  }
  // If there isn't a sensible size of the deserialised result
  // assume it isn't countable:
  return null;
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
