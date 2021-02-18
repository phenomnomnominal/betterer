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
  const goal = createGoal(config);

  if (isComplex(config)) {
    return {
      printer: config.printer || defaultPrinter,
      ...config,
      goal,
      deadline,
      type
    } as BettererTestConfig<DeserialisedType, SerialisedType, DiffType>;
  }

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
  config: BettererTestConfigPartial<DeserialisedType, SerialisedType, DiffType>
): number {
  const { deadline } = config;
  if (deadline == null) {
    return Infinity;
  }
  const maybeDate = new Date(deadline).getTime();
  return !isNaN(maybeDate) ? maybeDate : Infinity;
}

function createGoal<DeserialisedType, SerialisedType, DiffType>(
  config: BettererTestConfigPartial<DeserialisedType, SerialisedType, DiffType>
): BettererTestGoal<DeserialisedType> {
  const hasGoal = Object.hasOwnProperty.call(config, 'goal');
  if (!hasGoal) {
    return () => false;
  }
  const { goal } = config;
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
