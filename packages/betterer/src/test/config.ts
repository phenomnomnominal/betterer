import { CONSTRAINT_FUNCTION_REQUIRED, TEST_FUNCTION_REQUIRED } from '../errors';
import { isFunction } from '../utils';
import { BettererTestConfig, BettererTestConfigPartial, BettererTestGoal } from './types';

export function createTestConfig<DeserialisedType, SerialisedType, DiffType>(
  config: BettererTestConfigPartial<DeserialisedType, SerialisedType, DiffType>
): BettererTestConfig {
  if (config.constraint == null) {
    throw CONSTRAINT_FUNCTION_REQUIRED();
  }
  if (config.test == null) {
    throw TEST_FUNCTION_REQUIRED();
  }

  const { constraint, test, differ, printer, serialiser } = config;
  const goal = createGoal(config);
  const deadline = createDeadline(config);

  return { constraint, goal, deadline, test, differ, printer, serialiser } as BettererTestConfig;
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
  return (value: unknown): boolean => value === goal;
}
