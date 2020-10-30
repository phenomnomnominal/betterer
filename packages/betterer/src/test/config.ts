import { BettererError } from '@betterer/errors/dist/error';
import { diffΔ } from '@betterer/logger';
import { BettererResultValue } from '../results';
import { isFunction } from '../utils';
import {
  BettererTestConfig,
  BettererTestConfigPartial,
  BettererTestConfigComplexPartial,
  BettererTestGoal,
  BettererDiff
} from './types';

export function createTestConfig<DeserialisedType extends BettererResultValue, SerialisedType, DiffType>(
  config: BettererTestConfigPartial<DeserialisedType, SerialisedType, DiffType>
): BettererTestConfig<DeserialisedType, SerialisedType, DiffType> | BettererTestConfig<number> {
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
    return { ...config, deadline } as BettererTestConfig<DeserialisedType, SerialisedType, DiffType>;
  }

  const goal = createGoal(config);
  return {
    ...config,
    differ: defaultDiffer,
    printer: defaultPrinter,
    serialiser: { deserialise: defaultDeserialiser, serialise: defaultSerialiser },
    goal,
    deadline
  } as BettererTestConfig<number>;
}

function createDeadline<DeserialisedType extends BettererResultValue, SerialisedType, DiffType>(
  options: BettererTestConfigPartial<DeserialisedType, SerialisedType, DiffType>
): number {
  const { deadline } = options;
  if (deadline == null) {
    return Infinity;
  }
  const maybeDate = new Date(deadline).getTime();
  return !isNaN(maybeDate) ? maybeDate : Infinity;
}

function createGoal<DeserialisedType extends BettererResultValue, SerialisedType, DiffType>(
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

function isComplex<DeserialisedType extends BettererResultValue, SerialisedType, DiffType>(
  config: BettererTestConfigPartial<DeserialisedType, SerialisedType, DiffType>
): config is BettererTestConfigComplexPartial<DeserialisedType, SerialisedType, DiffType> {
  const maybeComplex = config as BettererTestConfigComplexPartial<DeserialisedType, SerialisedType, DiffType>;
  return !!(maybeComplex.differ && maybeComplex.printer && maybeComplex.serialiser);
}

export function defaultDiffer(expected: number, result: number): BettererDiff<number, null> {
  return {
    expected,
    result,
    diff: null,
    log(): void {
      diffΔ(expected, result);
    }
  };
}

function defaultPrinter(serialised: number): string {
  return JSON.stringify(serialised);
}

function defaultDeserialiser(serialised: number): number {
  return serialised;
}

function defaultSerialiser(deserialised: number): number {
  return deserialised;
}
