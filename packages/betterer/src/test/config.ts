import { BettererError } from '@betterer/errors';
import { BettererLogger, diffΔ } from '@betterer/logger';
import { format } from 'prettier';

import { isFunction } from '../utils';
import { BettererTestType } from './type';
import {
  BettererTestConfig,
  BettererTestConfigPartial,
  BettererTestConfigComplexPartial,
  BettererTestGoal,
  BettererDiff
} from './types';

export function createTestConfig<DeserialisedType, SerialisedType, DiffType>(
  config: BettererTestConfigPartial<DeserialisedType, SerialisedType, DiffType>,
  type = BettererTestType.Unknown
): BettererTestConfig<DeserialisedType, SerialisedType, DiffType> | BettererTestConfig<unknown> {
  if (config.constraint == null) {
    throw new BettererError('for a test to work, it must have a `constraint` function. ❌');
  }

  if (config.test == null) {
    throw new BettererError('for a test to work, it must have a `test` function. ❌');
  }

  const deadline = createDeadline(config);

  if (isComplex(config)) {
    if (config.goal == null) {
      throw new BettererError('for a test to work, it must have a `goal` function. ❌');
    }
    return {
      ...config,
      deadline,
      printer: config.printer || defaultPrinter,
      type
    } as BettererTestConfig<DeserialisedType, SerialisedType, DiffType>;
  }

  const goal = createGoal(config);

  return {
    ...config,
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
): BettererTestGoal<DeserialisedType> {
  const hasGoal = Object.hasOwnProperty.call(options, 'goal');
  if (!hasGoal) {
    return (): boolean => false;
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
