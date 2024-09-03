import type { BettererLogs } from '@betterer/logger';

import type {
  BettererTestConfig,
  BettererTestOptions,
  BettererTestOptionsComplex,
  BettererTestGoal,
  BettererDiff
} from './types.js';

import { BettererError } from '@betterer/errors';
import { diff__ } from '@betterer/logger';
import { format } from 'prettier';

import { isFunction } from '../utils.js';

export function createTestConfig<DeserialisedType, SerialisedType, DiffType>(
  options: BettererTestOptions<DeserialisedType, SerialisedType, DiffType>
): BettererTestConfig<DeserialisedType, SerialisedType, DiffType> | BettererTestConfig {
  // The `createTestConfig` function could be called from JS code, without type-checking.
  // We *could* change the parameter to be `Partial<BettererTestOptions<...>>`,
  // but that would imply that it was optional, but it isn't.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- see above!
  if (options.constraint == null) {
    throw new BettererError('for a test to work, it must have a `constraint` function. ❌');
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- see above!
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
  if (isFunction(goal)) {
    return goal as BettererTestGoal<DeserialisedType>;
  }
  return (value: DeserialisedType): boolean => value === goal;
}

type MaybeComplex<DeserialisedType, SerialisedType, DiffType> = Partial<
  BettererTestOptionsComplex<DeserialisedType, SerialisedType, DiffType>
>;

function isComplex<DeserialisedType, SerialisedType, DiffType>(
  options: BettererTestOptions<DeserialisedType, SerialisedType, DiffType>
): options is BettererTestOptionsComplex<DeserialisedType, SerialisedType, DiffType> {
  const maybeComplex = options as MaybeComplex<DeserialisedType, SerialisedType, DiffType>;
  return !!maybeComplex.differ && !!maybeComplex.serialiser;
}

export function defaultDiffer(expected: unknown, result: unknown): BettererDiff<unknown> {
  const diff = diff__(expected, result, { aAnnotation: 'Expected', bAnnotation: 'Result' });
  const logs: BettererLogs = diff ? [{ error: diff }] : [];
  return {
    diff: null,
    logs
  };
}

async function defaultPrinter(serialised: unknown): Promise<string> {
  return await format(JSON.stringify(serialised), { parser: 'json' });
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
